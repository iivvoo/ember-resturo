import Ember from 'ember';

import {
  validator, buildValidations
}
from 'ember-cp-validations';
import BufferedProxy from 'ember-buffered-proxy/proxy';

var Validations = buildValidations({
  username: validator('presence', true),
  password: [
    validator('presence', true),
    validator('length', {
      min: 4,
      max: 8
    })
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

    setupModelValidation: function() {
        var model = this.store.createRecord('user');

        this.set('orig', model);

        var wrapped = ValidUser.create({
            content: model
        });

        //debugger;
        this.set('model', wrapped);

    }.on('init'),

    actions: {
        register: function() {
            this.get('model').applyChanges();
            this.get('orig').save().then(r => {
                console.log("Suc", r);
                console.log(r.get('jwt_token'));

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

                ses.restore().then(a => {
                    console.log("restore s", a);
                    this.transitionToRoute('application');
                }).catch(e => {
                    console.log("restore e", e);
                    // XXX Feed error back to the form
                });

            }).catch(e => {
            
                console.log("Err", e);
            });
        }
    }
});

