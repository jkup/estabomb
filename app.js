var express = require('express');
var uuid = require('node-uuid');
var io = require('socket.io').listen(1338);
var app = express();

app.use(express.bodyParser());

var meetings = {
	"mashery": {
		users: {
			'1111-2222-3333-4444': {
                id: '1111-2222-3333-4444',
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			},
			'1111-2222-3333-5555': {
                id: '1111-2222-3333-5555',
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			}
		}
	},
	"medhub": {
		users: {
			"1111-2222-3333-4444": {
                id: '1111-2222-3333-4444',
				name: "Kelly",
				hasEstimated: true,
				estimate: "medium",
			},
			'1111-2222-3333-4445': {
                id: '1111-2222-3333-4445',
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			}
		}
	}
};

// TODO remove user from meeting on disconnect.
io.sockets.on('connection', function (socket) {

    // Let's just make a user record here
    var socketUser = {
        id: uuid.v4(),
        name: null
    };

    socket.on('join', function (data) {
		var id = data.id;

		// If the room doesn't exist
		if(meetings[id] == undefined) {
			//create a new room
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
		socket.emit('roomStatus', { room: meetings[id] });
        setInterval(function() {socket.emit('roomStatus', { room: meetings[id] });}, 1000);
	});
    socket.on('disconnect', function() { socket.emit("playerPart", {player: socketUser}); }) ;
});

app.listen(process.env.PORT || 1337);
