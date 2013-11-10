var socket = io.connect('http://localhost:1338');

window.Estabomb = Ember.Application.create({
//    LOG_TRANSITIONS: true
});

// roomStatus is essentially a datastore update function, so lets
// treat it like that
Estabomb.ApplicationAdapter = DS.FixtureAdapter.extend({
    init: function() {
        var self = this;
        this._super();
        socket.on('roomStatus', function(room) {
            console.log('socket roomStatus', room);
            self.updateRoomStatus(room);
        });
    },

    updateRoomStatus: function(room) {
        console.log('update', room);
    }
});

Estabomb.LoginController = Ember.Controller.extend({
    actions: {
        joinRoom: function() {
            this.transitionToRoute('room', 1);

            var name = $('#name').val();
            var room = $('#room').val();
            
            socket.emit('join', {
                'name': name,
                'room': room
            });

        }
    }
});

Estabomb.RoomController = Ember.ArrayController.extend({
    // initial value
    setup: function(controller, data) {
        self = this;
        socket.on('roomStatus', function(room) {
            console.log('socket roomStatus', room);
            self.controllerFor('room').roomStatus(room);
        });
    },
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
