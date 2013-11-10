Estabomb.Router.map(function () {
    this.resource('login', { path: '/' });
    this.resource('room', { path: '/rooms/:room_id' });
});

Estabomb.RoomRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('player');
    }
});