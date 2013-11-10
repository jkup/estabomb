Estabomb.Router.map(function () {
    this.resource('login', { path: '/' });
    this.resource('room', { path: '/rooms/:room_id' });
});

Estabomb.RoomRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        if (Estabomb.getWithDefault('name', null) == null) {
            Estabomb.set('room', transition.params.room_id);
            this.transitionTo('login');
        }
    },
    model: function () {
        return this.store.find('player');
    }
});