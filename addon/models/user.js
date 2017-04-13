import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  username: attr('string'),
  email: attr('string'),
  first_name: attr('string'),
  last_name: attr('string'),
  password: attr('string'),
  jwt_token: attr('string')
});
