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
socket.on('test', function(data) {
    var newpath = polyline.getPath();
    newpath.push(new google.maps.LatLng(data.lat,data.lng));
    polyline.setPath(newpath);
    document.getElementById("display-latlng").innerHTML = "Last lat/long: " + data.lat + " " + data.lng;
    console.log(data);
});

function clearpath() {
    var newpath = [];
    polyline.setPath(newpath);
    console.log("Cleared path data");
}

function savepath() {
    var pathstring = polyline.getPath().getArray().toString();
    socket.emit('writelog',{pathstring});
    console.log("Trying to write path to log file");
}