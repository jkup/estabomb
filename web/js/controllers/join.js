Estabomb.JoinRoute = Ember.Route.extend({
    model: function (params) {
        return { room: params.room_id };
    }
});
Estabomb.JoinController = Ember.Controller.extend({
    joinRoomText: function() {
        return "Join "+this.get('model').room;
    }.property(),

    actions: {
        joinRoom: function() {
            var name = $('#name').val();
            var room = this.get('model').room;

            Estabomb.set('name', name);

            socket.emit('join', {
                'name': name,
                'room': room
            });

            this.transitionToRoute('room', room);
        }
    }
});
