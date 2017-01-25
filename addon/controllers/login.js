import Ember from 'ember';

const {
 isNone,
 typeOf
} = Ember;

export default Ember.Controller.extend({
  session: Ember.inject.service(),

  actions: {
    authenticate: function() {
      var credentials = this.getProperties('identification', 'password'),
        authenticator = 'authenticator:jwt';

      let routeToRedirectTo = 'application';
      if(!isNone(this.get('session.attemptedTransition') ) ) {
        routeToRedirectTo = this.get('session.attemptedTransition');
      }

      this.get('session').authenticate(authenticator, credentials
      ).then(() => {
        console.log("Auth ok");

        if(typeOf(routeToRedirectTo) === 'object') {
          return routeToRedirectTo.retry();
        }

        return this.transitionToRoute(routeToRedirectTo);
      }).catch(e => {
        // assume credentials were incorrect
        console.log(e);
        this.set('errorMessage', "Username or password incorrect");
      });
    }
  }
});
