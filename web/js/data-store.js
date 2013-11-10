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