import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    email: DS.attr('string'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    password: DS.attr('string'),
    jwt_token: DS.attr('string')
});

