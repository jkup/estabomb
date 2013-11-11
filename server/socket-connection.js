var uuid = require('node-uuid');

function SocketConnection(io, rooms) {
    this.io = io;
    this.rooms = rooms;
    this.user = {
        id: uuid.v4(),
        name: null,
        hasEstimated: false,
        estimate: ''
    };
    this.room = null;
}

SocketConnection.prototype.bindSocket = function SocketConnection_bindSocket(socket) {
    this.socket = socket;

    var self = this;

    socket.on('join', function() { self.onJoin.apply(self, arguments); });
    socket.on('disconnect', function() { self.onDisconnect.apply(self, arguments); });
    socket.on('beginEstimating', function() { self.beginEstimating.apply(self, arguments); });
    socket.on('estimate', function() { self.receiveEstimate.apply(self, arguments); });
};


SocketConnection.prototype.onJoin = function SocketConnection_onJoin(data) {
    this.room = this.getRoom(data.room);

    this.socket.join(this.room.name);

    this.user.name = data.name;

    this.room.users[this.user.id] = this.user;

    this.sendRoomStatus(this.room);
};

SocketConnection.prototype.onDisconnect = function SocketConnection_onDisconnect() {
    if (this.room) {
        delete this.room.users[this.user.id];
        this.io.sockets.in(this.room.name).emit("playerPart", { user: { id: this.user.id, name: this.user.name} });
    }
};

SocketConnection.prototype.beginEstimating = function SocketConnection_beginEstimating() {
    this.io.sockets.in(this.room.name).emit('getEstimate');
    this.room.estimating = true;

    this.sendRoomStatus(this.room);
};

SocketConnection.prototype.receiveEstimate = function SocketConnection_receiveEstimate(estimate) {
    this.user.hasEstimated = true;
    this.room.users[this.user.id].estimate = estimate;

    this.sendRoomStatus(this.room);
};

SocketConnection.prototype.getRoom = function SocketConnection_getRoom(roomName) {
    // If the room doesn't exist, create it
    if(this.rooms[roomName] == undefined) {
        this.rooms[roomName] = {name: roomName, users:{}, estimating: false};
    }

    return this.rooms[roomName];
};

SocketConnection.prototype.isRoomStillEstimating = function SocketConnection_isRoomStillEstimating(room) {
    var finished = true;

    for(var i in this.room.users) {
        if (this.room.users[i].hasEstimated === false) {
            finished = false;
            break;
        }
    }

    return !finished;
};

SocketConnection.prototype.sendRoomStatus = function SocketConnection_sendRoomStatus(room)
{
    var roomToSend = room;

    roomToSend.estimating = this.isRoomStillEstimating(room);


    if (roomToSend.estimating) {
        var redactedRoom = {
            name: roomToSend.name,
            estimating: true,
            users: {}
        };
        for(var i in roomToSend.users) {
            var u = roomToSend.users[i];
            redactedRoom.users[i] = {
                id: u.id,
                name: u.name,
                hasEstimated: u.hasEstimated,
                estimate: ''
            };
        }
        roomToSend = redactedRoom;
    } else {
        for (var i in roomToSend.users) {
            roomToSend.users[i].hasEstimated = false;
        }
    }

    this.io.sockets.in(roomToSend.name).emit('roomStatus', { room: roomToSend });
};

module.exports = SocketConnection;