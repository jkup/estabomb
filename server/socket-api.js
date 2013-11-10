var uuid = require('node-uuid');
var extend = require('util')._extend;

var SocketAPI = function(io, rooms) {
    this.io = io;
    this.rooms = rooms;
};

SocketAPI.prototype.connect = function() {
    var io = this.io;
    var rooms = this.rooms;
    var connections = [];

    io.sockets.on('connection', function(socket) {

        var user = {
            id: uuid.v4(),
            name: null,
            hasEstimated: false,
            estimate: ''
        };

        socket.on('join', function(data) {
            var room = getRoom(data.room);

            user.name = data.name;

            room.users[user.id] = user;

            sendRoomStatus(room);
        });

        socket.on('disconnect', function() {
            var user =
            io.sockets.emit("playerPart", { user: {}});
        });

        function getRoom(room) {
            // If the room doesn't exist, create it
            if(rooms[room] == undefined) {
                rooms[room] = {name: room, users:{}, estimating: false};
            }

            return rooms[room];
        }

        function sendRoomStatus(room)
        {
            var roomToSend = rooms[room];

            if (rooms[room].estimating) {
                var redactedRoom = extend({}, roomToSend);
                redactedRoom.users = extend({}, redactedRoom.users);
                redactedRoom.users.forEach(function(user) { user.estimate = '' });
                roomToSend = redactedRoom;
            }

            io.sockets.emit('roomStatus', { room: roomToSend });
        }
    });
};

module.exports = SocketAPI;