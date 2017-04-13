import Ember from 'ember';
import formBufferProperty from 'ember-validated-form-buffer';
import { validator, buildValidations } from 'ember-cp-validations';
import layout from './template';

let Validations = buildValidations({
  password: [
    validator('presence', true),
    validator('length', { min: 4, max: 8 })
  ],
  passwordConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'password',
      message: 'do not match',
      description: 'Passwords'
    })
  ]
});

const { Component, getOwner } = Ember;

export default Component.extend({
  layout: layout,
  token: 'Not Set',
  errorMessage: '',

  model: { password: '', passwordConfirmation: '' },
  data: formBufferProperty('model', Validations),
  reset_completed: false,

  actions: {
    change_password() {
      this.get('data').applyBufferedChanges();
      let password = this.get('model.password');
      let token = this.get('token');

      let adapter = getOwner(this).lookup('adapter:application');
      let url = adapter.buildURL('users');
      let res = adapter.ajax(`${url}reset`, 'POST', { data: { token: token, password: password } });

      res.then(() => {
        this.set('reset_completed', true);
      }, () => {
        this.set('errorMessage', 'Invalid Token');
      }).catch(() => {
        this.set('errorMessage', 'Invalid Token');
      });
    }
  }
});
