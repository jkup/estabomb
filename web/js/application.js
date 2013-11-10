window.Estabomb = Ember.Application.create();

Estabomb.ApplicationAdapter = DS.FixtureAdapter.extend();

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
        }
    }
});