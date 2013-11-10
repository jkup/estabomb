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

        var room = null;

        socket.on('join', function(data) {
            room = getRoom(data.room);

            socket.join(room.name);

            user.name = data.name;

            room.users[user.id] = user;

            sendRoomStatus(room);
        });

        socket.on('disconnect', function() {
            if (room) {
                delete room.users[user.id];
                io.sockets.in(room.name).emit("playerPart", { user: { id: user.id, name: user.name} });
            }
        });

        socket.on('beginEstimating', function() {
            io.sockets.in(room.name).emit('getEstimate');
        });

        socket.on('estimate', function(data) {
            user.hasEstimated = true;
            user.estimate = data;

            sendRoomStatus(room);
        });

        function getRoom(roomName) {
            // If the room doesn't exist, create it
            if(rooms[roomName] == undefined) {
                rooms[roomName] = {name: roomName, users:{}, estimating: false};
            }

            return rooms[roomName];
        }

        function isRoomStillEstimating(room) {
            var finished = true;

            for(var i in room.users) {
                if (room.users[i].hasEstimated === false) {
                    finished = false;
                    break;
                }
            }

            return !finished;
        }

        function sendRoomStatus(room)
        {
            var roomToSend = room;

            roomToSend.estimating = isRoomStillEstimating(room);

            if (roomToSend.estimating) {
                var redactedRoom = extend({}, roomToSend);
                redactedRoom.users = extend({}, redactedRoom.users);
                for(var i in redactedRoom.users) {
                    redactedRoom.users[i].estimate = '';
                }
                roomToSend = redactedRoom;
            } else {
                for (var i in roomToSend.users) {
                    roomToSend.users[i].hasEstimated = false;
                }
            }

            io.sockets.in(roomToSend.name).emit('roomStatus', { room: roomToSend });
        }
    });
};

module.exports = SocketAPI;