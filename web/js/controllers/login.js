// roomStatus is essentially a datastore update function, so lets
Estabomb.LoginController = Ember.Controller.extend({
    actions: {
        joinRoom: function() {
            var name = $('#name').val();
            var room = $('#room').val();

            Estabomb.set('name', name);

            socket.emit('join', {
                'name': name,
                'room': room
            });

            this.transitionToRoute('room', room);
        }
    }
});
