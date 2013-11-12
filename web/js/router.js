Estabomb.Router.reopen({
    rootURL: '/'
});
Estabomb.Router.map(function () {
    this.resource('login', { path: '/' });
    this.resource('join', { path: '/rooms/:room_id/join' });
    this.resource('room', { path: '/rooms/:room_id' });
});