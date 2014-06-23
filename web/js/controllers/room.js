Estabomb.RoomRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        if (Estabomb.getWithDefault('name', null) == null) {
            this.transitionTo('join', transition.params.room_id );
        }
    },
    setupController: function(controller, model) {
        controller.set('model', model);
        Ember.Instrumentation.subscribe("getEstimate", {
            before: function(name, timestamp, payload) {
                console.log('Recieved ', name, ' at ' + timestamp + ' with payload: ', payload);
                controller.send('getEstimate', payload);
            },
            after: function() {}
        });
    },
    model: function () {
        return this.store.find('player');
    }
});

socket.on('getEstimate', function(context) {
    Ember.Instrumentation.instrument("getEstimate", context);
});

Estabomb.RoomController = Ember.ArrayController.extend({
    // initial value
    joinUrl: function() {
        return window.location+'/join';
    }.property(),
    hasEstimated: false,
    actions: {
        estimate: function(estimate) {
            console.log(estimate);
            this.set('hasEstimated', true);
            socket.emit('estimate', estimate);
            $('#estimationPanel').modal('hide')
        },

        reset: function() {
            $('.options').css('display', 'block');
            this.set('hasEstimated', false);
        },

        getEstimate: function() {
            console.log('get estimate');
            $('#estimationPanel').modal('show');
        },

        beginEstimating: function() {
            socket.emit('beginEstimating');
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
            var estimates = ['1', '2', '3', '5', '8', '11', '20', '?'];

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
