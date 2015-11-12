import Ember from 'ember';

import { validator, buildValidations } from 'ember-cp-validations';
import BufferedProxy from 'ember-buffered-proxy/proxy';

var Validations = buildValidations({
  username: validator('presence', true),
  password: [
    validator('presence', true),
    /*
    validator('length', {
      min: 4,
      max: 8
    })
    XXX Disabled - mixed with presence seems to
    break 'presence' detection ?!
    */
  ],
  passwordConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'password',
      message: 'do not match',
      description: 'Passwords'
    })
  ],
  email: [
    validator('presence', true),
    validator('format', { type: 'email' })
  ]
});

var ValidUser = BufferedProxy.extend(Validations);

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    errorMessage: '',
    errors: [],

    setupModelValidation: function() {
        var model = this.store.createRecord('user');

        this.set('orig', model);

        var wrapped = ValidUser.create({
            content: model
        });

        this.set('model', wrapped);

    }.on('init'),

    actions: {
        register: function() {
            this.get('model').applyChanges();
            this.get('orig').save().then(r => {
                var authenticator = 'simple-auth-authenticator:jwt';

                // A bit of a hack, required with the newer ember-simple-auth.
                // This will give us the 'internal-session' ?
                var ses = this.get('session.session');
                ses.set('content', {
                                   authenticated: {
                                                   'authenticator': authenticator,
                                                   'token': r.get('jwt_token')
                                                  }
                                   });
                ses._updateStore();

                ses.restore().then(() => {
                    this.transitionToRoute('application');
                }).catch(e => {
                    this.set('errorMessage',
                             "An error occured while completing registration");
                    this.set('errors', e.errors);
                });

            }).catch(e => {
                let errs = this.get('orig.errors');
                this.set('errorMessage', "An error occured while completing registration");
                this.set('errors', errs);
                errs.forEach(e => {
                    console.log(e);
                    this.set(`model.validations.attrs.${e.attribute}.messages`, Ember.A([e.message]));
                    this.set(`model.validations.attrs.${e.attribute}.isValid`, false);

                });
            });
        }
    }
});

