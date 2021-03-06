var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var path = require('path');
var fs = require('fs');

var logData = {};

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
	io.sockets.emit('newPoint',req.body);
	console.log(req.body);
});

function readLogs() {
	var filepath = path.join(__dirname,'logs');
	var filenames = fs.readdirSync(filepath);
	console.log(filenames);
	logData = {};
	filenames.forEach(function(filename) {
		if (filename != ".gitkeep") {
			console.log(filename);
			logData[filename] = fs.readFileSync(path.join(filepath,filename),'utf-8');
			console.log(logData[filename]);
		}
	});
}

io.on('connection', function(socket){
	console.log('a user connected');
	readLogs();
	socket.emit('showPaths',{logData: logData});

	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});

	socket.on('writeLog', function(data){
		var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
		var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().replace(/:/g,"-").slice(0,-5);
		var filename = localISOTime+'.txt';
		console.log(filename);
		var filePath = path.join(__dirname, 'logs', filename);
		fs.writeFile(filePath, data.path, function(err) {
		    if(err) {
		        return console.log('Unable to write file ' + err);
		    }
		    console.log('File was saved');
		});
		logData[filename] = data.path;
		socket.emit('showPaths',{logData: logData});
	});

	socket.on('loadLogs', function(data){
		readLogs();
		socket.emit('newPath',{points: logData[data.logfile]});
	});

	socket.on('deleteLog', function(data) {
		var filePath = path.join(__dirname, 'logs', data.logfile);
		fs.unlink(filePath, function(err) {
			if (err) {
				return console.log('Unable to delete file ' + err);
			}
			console.log('File was deleted');
		});
		delete logData[data.logfile];
		socket.emit('showPaths',{logData: logData});
	});
});

