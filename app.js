var express = require('express');
var uuid = require('node-uuid');
var app = express();

app.use(express.bodyParser());

var meetings = {
	"mashery": {
		users: {
			'1111-2222-3333-4444': {
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			},
			'1111-2222-3333-5555': {
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			}
		}
	},
	"medhub": {
		users: {
			"1111-2222-3333-4444": {
				name: "Kelly",
				hasEstimated: true,
				estimate: "medium",
			},
			'1111-2222-3333-4445': {
				name: "Kelly",
				hasEstimated: false,
				estimate: "medium",
			}
		}
	}
};

app.get('/join/:id/:name', function(req, res) {
	var id = req.params.id;

	// If the room doesn't exist
	if(meetings[id] == undefined) {
		//create a new room
		meetings[id] = {users:{}};
	}

	//TODO add user to meeting
	var unique_id = uuid.v4();
	var user = {
		name: req.params.name,
		hasEstimated: false,
		estimate: ''
	};

	meetings[id].users[unique_id] = user;
	return res.json(meetings[id]);
});

app.post('/quote', function(req, res) {
  if(!req.body.hasOwnProperty('author') || !req.body.hasOwnProperty('text')) {
    res.statusCode = 400;
    return res.send('Error 400: Post syntax incorrect.');
  }

  var newQuote = {
    author : req.body.author,
    text : req.body.text
  };

  quotes.push(newQuote);
  res.json(true);
});

app.delete('/quote/:id', function(req, res) {
  if(quotes.length <= req.params.id) {
    res.statusCode = 404;
    return res.send('Error 404: No quote found');
  }

  quotes.splice(req.params.id, 1);
  res.json(true);
});

app.listen(process.env.PORT || 1337);
