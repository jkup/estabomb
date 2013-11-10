var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/../web'));

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

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

var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});

var SocketAPI = require('./socket-api.js');
var RestAPI = require('./rest-api.js');

var socketApi = new SocketAPI(io, meetings);
socketApi.connect();