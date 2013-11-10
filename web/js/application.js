window.Estabomb = Ember.Application.create({
//    LOG_TRANSITIONS: true
});

Estabomb.ApplicationAdapter = DS.FixtureAdapter;

Estabomb.LoginController = Ember.Controller.extend({
    actions: {
        joinRoom: function() {
            var name = $('#name').val();
            var room = $('#room').val();
            
            socket.emit('join', {
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
        }
    }
});