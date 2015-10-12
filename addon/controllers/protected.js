import Ember from 'ember';

export default Ember.Controller.extend({
    after_logout: 'login',
    session: Ember.inject.service(),

    actions: {
        invalidateSession() {
            this.get('session').invalidate();
            // no index route yet. Make configurable?
            this.transitionToRoute(this.get('after_logout'));
        }
    }
});
