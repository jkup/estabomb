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
            self.removePlayer(data.user);
        });
    },

    updateRoomStatus: function(room) {
        this.store.unloadAll('player');
        for (var id in room.users) {
            if (this.store.hasRecordForId(Estabomb.Player, id)) {
                this.store.update(Estabomb.Player, room.users[id]);
            } else {
                this.store.push(Estabomb.Player, room.users[id]);
            }
        }
    },

    removePlayer: function(player) {
        if (this.store.hasRecordForId(Estabomb.Player, player.id)) {
            var p = this.store.typeMapFor(Estabomb.Player).idToRecord[player.id];
            p.deleteRecord();
            p.save();
        }
    }
});