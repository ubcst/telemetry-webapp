var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var path = require('path');
var fs = require('fs');

app.use( bodyParser.json() );
app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

http.listen(3000, function () {
	console.log('UBCST Telemetry app listening on port 3000');
});

app.post('/', function (req, res) {
	res.send('Got a POST request');
	io.sockets.emit('test',req.body);
	console.log(req.body);
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});

	socket.on('writelog', function(data){
		var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().replace(/:/g,"-").slice(0,-5);
		var filename = localISOTime+'.txt';
		console.log(filename);
		var filePath = path.join(__dirname, 'logs', filename);
		fs.writeFile(filePath, data.pathstring, function(err) {
		    if(err) {
		        return console.log('Unable to write file ' + err);
		    }
		    console.log('File was saved');
		});
	});
});

