import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        foo: {
        },
        authenticate: function() {
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'simple-auth-authenticator:jwt';

            this.get('session').authenticate(authenticator, credentials
            ).then(() => {
                console.log("Auth ok");
                //this.transitionTo('application');
            }).catch(message => {
                this.set('errorMessage', message);
            });
        }
    }
});

