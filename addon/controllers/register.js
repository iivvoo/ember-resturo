import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { validator, buildValidations } from 'ember-cp-validations';

let Validations = buildValidations({
  username: validator('presence', true),
  password: [
    validator('presence', true),
    validator('length', { min: 4 })
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

let ValidUser = BufferedProxy.extend(Validations);

const { Controller, inject, setOwner, getOwner } = Ember;

export default Controller.extend({
  session: inject.service(),
  errorMessage: '',
  errors: [],

  setupModelValidation() {
    let model = this.store.createRecord('user');

    this.set('orig', model);

    let wrapped = ValidUser.create({ content: model });

    setOwner(wrapped, getOwner(this));

    this.set('model', wrapped);
  }.on('init'),

  actions: {
    register() {
      this.get('model').applyChanges();
      this.get('orig').save().then(response => {
        // A bit of a hack, required with the newer ember-simple-auth.
        // This will give us the 'internal-session' ?
        let ses = this.get('session.session');
        ses.set('content', {
          authenticated: { authenticator: 'authenticator:jwt', token: response.get('jwt_token') }
        });

        ses._updateStore();

        ses.restore().then(() => {
          this.transitionToRoute('application');
        }).catch(error => {
          this.set('errorMessage', 'An error occured while completing registration');
          this.set('errors', error.errors);
        });
      }).catch(() => {
        let errors = this.get('orig.errors');
        this.set('errorMessage', 'An error occured while completing registration');
        this.set('errors', errors);
        errors.forEach(error => {
          console.log(error);
          this.set(`model.validations.attrs.${error.attribute}.messages`, Ember.A([error.message]));
          this.set(`model.validations.attrs.${error.attribute}.isValid`, false);
        });
      });
    }
  }
});
