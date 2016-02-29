var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
app.use( bodyParser.json() );

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.post('/', function (req, res) {
  res.send('Got a POST request');
  io.sockets.emit('test',req.body);
  console.log(req.body);
});

io.on('connection', function(socket){
  console.log('a user connected');
});