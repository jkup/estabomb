var socket = io.connect('http://localhost:1338');

window.Estabomb = Ember.Application.create({
//    LOG_TRANSITIONS: true
});

// roomStatus is essentially a datastore update function, so lets
// treat it like that
Estabomb.initializer({
    name: "injectStoreToo",

    initialize: function(container, application) {
        application.inject('adapter', 'store', 'store:main');
    }
});
Estabomb.ApplicationAdapter = DS.FixtureAdapter.extend({
    init: function() {
        var self = this;
        socket.on('roomStatus', function(data) {
            self.updateRoomStatus(data.room);
        });
        socket.on('playerPart', function(data) {
            self.removePlayer(data.player);
        });
    },

    updateRoomStatus: function(room) {
        this.store.unloadAll('player');
        for (var id in room.users) {
            if (this.store.hasRecordForId('player', id)) {
                this.store.update('player', room.users[id]);
            } else {
                this.store.push('player', room.users[id]);
            }
        }
    },

    removePlayer: function(player) {

    }
});

Estabomb.LoginController = Ember.Controller.extend({
    room: function() {
        return Estabomb.getWithDefault('room', null)
    }.property(),

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

Estabomb.RoomController = Ember.ArrayController.extend({
    // initial value
    hasEstimated: false,
    actions: {
        estimate: function(estimate) {
            console.log(estimate);
            this.set('hasEstimated', true);
            $('#estimationPanel').modal('hide')
        },

        reset: function() {
            $('.options').css('display', 'block');
            this.set('hasEstimated', false);
        },

        newEstimate: function() {
            $('#estimationPanel').modal('show');
        },

        mockEstimate: function() {
            var players = this.get('model')
            var player = players.findBy('hasEstimated', false);
            if (player) {
                this.store.update('player', {
                    id: player.get('id'),
                    hasEstimated: true
                });
            }
        },

        mockAllEstimatesSubmitted: function() {
            var estimates = ['S', 'M', 'L', 'XL'];

            var players = this.get('model');

            var store = this.store;

            players.forEach(function(player) {
                var estimate_idx = Math.floor(Math.random() * (players.toArray().length + 1));

                store.update('player', {
                    id: player.get('id'),
                    hasEstimated: false,
                    estimate: estimates[estimate_idx]
                });
            });
        }
    }
});
