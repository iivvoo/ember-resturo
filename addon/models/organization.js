import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    mailboxes: DS.hasMany('mailbox', {'async':true})
});
