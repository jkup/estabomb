var SocketConnection = require('./socket-connection.js');

var SocketAPI = function(io, rooms) {
    this.io = io;
    this.rooms = rooms;
};

SocketAPI.prototype.connect = function() {
    var io = this.io;
    var rooms = this.rooms;
    var connections = [];

    io.sockets.on('connection', function(socket) {
        var conn = new SocketConnection(io, rooms);
        conn.bindSocket(socket);
        connections.push(conn);
        socket.on('disconnect', function() {
            var index = connections.indexOf(conn);
            connections.splice(index, 1);
        });
    });
};

module.exports = SocketAPI;