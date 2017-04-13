import Ember from 'ember';

const { Controller, inject, isNone, typeOf } = Ember;

export default Controller.extend({
  session: inject.service(),

  actions: {
    authenticate() {
      let credentials = this.getProperties('identification', 'password'),
          routeToRedirectTo = 'application';

      if (!isNone(this.get('session.attemptedTransition'))) {
        routeToRedirectTo = this.get('session.attemptedTransition');
      }

      this.get('session').authenticate('authenticator:jwt', credentials).then(() => {
        console.log('Auth ok');

        if (typeOf(routeToRedirectTo) === 'object') {
          return routeToRedirectTo.retry();
        }

        return this.transitionToRoute(routeToRedirectTo);
      }).catch(e => {
        // assume credentials were incorrect
        console.log(e);
        this.set('errorMessage', 'Username or password incorrect');
      });
    }
  }
});
