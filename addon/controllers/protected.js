import Ember from 'ember';

const { Controller, inject } = Ember;

export default Controller.extend({
  session: inject.service(),
  after_logout: 'login',

  actions: {
    invalidateSession() {
      this.get('session').invalidate();
      // no index route yet. Make configurable?
      this.transitionToRoute(this.get('after_logout'));
    }
  }
});
