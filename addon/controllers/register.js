import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
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
            
                var ses = this.get('session');
                ses.set('content', {secure: {'authenticator': authenticator, 'token': u.get('jwt_token')}});
                ses.updateStore();

                this.get('session').restore().then(a => {
                    console.log("restore s", a);
                    this.transitionTo('application');
                }).catch(e => {
                    console.log("restore e", e);

                });

            }).catch(e => {
            
                console.log("Err", e);
            });
        }
    }
});

