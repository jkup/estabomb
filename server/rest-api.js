var RestAPI = function(app, meetings) {
    this.app = app;
    this.meetings = meetings;
};

RestAPI.prototype.connect = function() {
    var app = this.app;
    var meetings = this.meetings;

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
}

module.exports = RestAPI;