window.Estabomb = Ember.Application.create({
//    LOG_TRANSITIONS: true
});

Estabomb.ApplicationAdapter = DS.FixtureAdapter;

// You can thank all of this room status stuff on:
// http://stackoverflow.com/questions/14458287/how-to-fire-an-event-to-ember-from-another-framework

Estabomb.ApplicationRoute = Em.Route.extend({
    setupController: function (controller, model) {
        Ember.Instrumentation.subscribe("roomStatus", {
            before: function(name, timestamp, payload) {
                console.log('Recieved ', name, ' at ' + timestamp + ' with payload: ', payload);
                controller.send('roomStatus', payload);
            },
            after: function() {}
        });
    }
});


Estabomb.socket = io.connect('http://localhost:1338');

Estabomb.socket.on('roomStatus', function (data) {
    console.log(data);
    Ember.Instrumentation.instrument("roomStatus", data.room);
});


Estabomb.LoginController = Ember.Controller.extend({
    actions: {
        joinRoom: function() {
            var name = $('#name').val();
            var room = $('#room').val();
            
            Estabomb.socket.emit('join', {
                'name': name,
                'room': room
            });

            this.transitionToRoute('room', 1);
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
        },

        roomStatus: function(room) {
            console.log('in controller', data);

            var store = this.store;
            var players = this.get('model');

            room.users.forEach(function(player) {
                // @TODO Handle when players leave ... no accounting here.
                var p = players.findBy('id', player.id)
                if (p) {
                    store.update('player', player);
                } else {
                    store.push('player', player);
                }
            });
        }
    }
});