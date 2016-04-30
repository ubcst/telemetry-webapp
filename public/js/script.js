var polyline;

var centerUBC = new google.maps.LatLng(49.2620657,-123.2492408);
var centerDetroit = new google.maps.LatLng(42.329638,-83.049796);

var defaultUBC = [
    {lat: 49.2625657, lng: -123.2482308},
    {lat: 49.2630657, lng: -123.2472308}
];
var defaultDetroit = [
    {lat: 42.329638, lng: -83.049796},
    {lat: 42.328496, lng: -83.048937}
];

function initialize() {
    var mapOptions = {
        center: centerUBC,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var pathCoords = defaultUBC;
    polyline = new google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    polyline.setMap(map);
}

var socket = io();
socket.on('newPoint', function(data) {
    var newpath = polyline.getPath();
    newpath.push(new google.maps.LatLng(data.lat,data.lng));
    polyline.setPath(newpath);
    document.getElementById("display-latlng").innerHTML = "Last lat/long: " + data.lat + " " + data.lng;
    console.log(data);
});

socket.on('newPath', function(data) {
    var newpath = google.maps.geometry.encoding.decodePath(data.points);
    polyline.setPath(newpath);
});

socket.on('showPaths', function(data) {
    var logFiles = data.logData;
    var logsList = document.getElementById("logs");
    console.log('Displaying stored paths')
    logsList.innerHTML = '';
    for (var logFile in logFiles) {
        if (logFiles.hasOwnProperty(logFile)) {
            var input = document.createElement("input");
            input.type = "radio";
            input.name = "logfile";
            input.id = logFile;
            input.value = logFile;
            input.appendChild(document.createTextNode(logFile));
            logsList.appendChild(input);

            var label = document.createElement("label");
            label.htmlFor = input.id;
            label.innerHTML = logFile;
            logsList.appendChild(label);

            logsList.appendChild(document.createElement("br"));
        }
    }
});

function getSelectedLog() {
    var logfile = "xx";
    var radios = document.getElementsByName('logfile');
    for (var i=0; i<radios.length; i++) {
        if ( radios[i].checked ) {
            logfile = radios[i].value;
            break;
        }
    }
    return logfile;
}

function clearpath() {
    var newpath = [];
    polyline.setPath(newpath);
    console.log("Cleared path data");
}

function savepath() {
    var encodedpath = google.maps.geometry.encoding.encodePath(polyline.getPath());
    socket.emit('writeLog',{path: encodedpath});
    console.log("Trying to write encoded path to log file");
}

function loadpath() {
    console.log("Ask server to send log");
    var logfile = getSelectedLog();
    socket.emit('loadLogs', {logfile: logfile});
}

function deletepath() {
    console.log("Ask server to delete log");
    var logfile = getSelectedLog();
    socket.emit('deleteLog', {logfile: logfile});
}