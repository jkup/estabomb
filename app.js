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
	socket.on('join', function (data) {
		var id = data.id;

		// If the room doesn't exist, create it
		if(meetings[id] == undefined) {
			meetings[id] = {users:{}};
		}

		var unique_id = uuid.v4();
		var user = {
            id: unique_id,
			name: data.name,
			hasEstimated: false,
			estimate: ''
		};

		meetings[id].users[unique_id] = user;
		io.sockets.emit('roomStatus', { room: meetings[id] });
	});
});

app.listen(process.env.PORT || 1337);
