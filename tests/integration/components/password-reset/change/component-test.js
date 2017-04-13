import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
// import hbs from 'htmlbars-inline-precompile';

moduleForComponent('password-reset/change', 'Integration | Component | password reset/change', {
  integration: true,
  beforeEach() {
    this.register('helper:t', Ember.Helper.helper((v) => { return v[0];}));
    this.register('helper:v-get', Ember.Helper.helper((v) => { return v[0];}));
  }
});

test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{password-reset/change}}`);

  assert.ok(this.$().text().match(/Password/));
});
