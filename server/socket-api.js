var uuid = require('node-uuid');

var SocketAPI = function(io, meetings) {
    this.io = io;
    this.meetings = meetings;
};
SocketAPI.prototype.connect = function() {
    var io = this.io;
    var meetings = this.meetings;

    io.sockets.on('connection', function (socket) {

        // Let's just make a user record here
        var socketUser = {
            id: uuid.v4(),
            name: null
        };

        socket.on('join', function (data) {
            var id = data.room;

            // If the room doesn't exist, create it
            if(meetings[id] == undefined) {
                meetings[id] = {users:{}};
            }

            // assign the name to the socket user
            socketUser.name = data.name;

            var user = {
                id: socketUser.id,
                name: data.name,
                hasEstimated: false,
                estimate: ''
            };

            meetings[id].users[socketUser.id] = user;
            io.sockets.emit('roomStatus', { room: meetings[id] });
        });
        socket.on('disconnect', function() { socket.emit("playerPart", {player: socketUser}); }) ;
    });

}

module.exports = SocketAPI;