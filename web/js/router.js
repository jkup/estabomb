Estabomb.Router.map(function () {
    this.resource('login', { path: '/' });
    this.resource('room', { path: '/rooms/:room_id' });
});