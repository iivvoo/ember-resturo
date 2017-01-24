import Ember from 'ember';
import layout from './template';
import { validator, buildValidations } from 'ember-cp-validations';
import formBufferProperty from 'ember-validated-form-buffer';

var Validations = buildValidations({
  handle: validator('presence', true)
});

export default Ember.Component.extend({
    layout: layout,

    model: Ember.Object.create({'handle': ''}),
    data: formBufferProperty('model', Validations),
    reset_requested: false,

    actions: {
        request_reset: function() {
            this.get('data').applyBufferedChanges();
            let handle = this.get("model.handle");
            // if handle is not empty
            let adapter = Ember.getOwner(this).lookup("adapter:application");
            let url = adapter.buildURL('users');
            let res = adapter.ajax(url + 'reset', 'GET',
             {data: {'handle': handle}});
            res.then(() => {
                this.set('reset_requested', true);
            });
        }
    }
});
