import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),

    actions: {
        register: function() {
            /*
             * Create user model; create user and save it, handle save errors.
             * profile? Unify user and profile in API?
             */
            var details = this.getProperties('identification', 'password', 'password2', 'email', 'first_name', 'last_name');
            console.log(details);
            //Ember.$.post('/user/', {username: details.identification, password: details.password, email: details.email});
            var u = this.store.createRecord('user', {
              username: details.identification,
              password: details.password,
              first_name: details.first_name,
              last_name: details.last_name,
              email: details.email
            });
            

            u.save().then(r => {
                console.log("Suc", r);
                console.log(u.get('jwt_token'));
                // localStorage: ember_simple_auth:session -> {"secure":{}}
                var authenticator = 'simple-auth-authenticator:jwt';
            
                // A bit of a hack, required with the newer ember-simple-auth.
                // This will give us the 'internal-session' ?
                var ses = this.get('session.session');
                ses.set('content', {authenticated: {'authenticator': authenticator, 'token': u.get('jwt_token')}});
                ses._updateStore();

                ses.restore().then(a => {
                    console.log("restore s", a);
                    this.transitionToRoute('application');
                }).catch(e => {
                    console.log("restore e", e);

                });

            }).catch(e => {
            
                console.log("Err", e);
            });
        }
    }
});

