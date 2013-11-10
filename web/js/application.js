window.Estabomb = Ember.Application.create();

Estabomb.ApplicationAdapter = DS.FixtureAdapter.extend();


Estabomb.RoomController = Ember.ArrayController.extend({
    // initial value
    hasEstimated: false,
    actions: {
        estimate: function(estimate) {
            console.log(estimate);
            $('.options').css('display', 'none');
            this.set('hasEstimated', true);
        },

        reset: function() {
            $('.options').css('display', 'block');
            this.set('hasEstimated', false);
        }
    }
});