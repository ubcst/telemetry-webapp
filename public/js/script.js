var path;
function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(42.329638,-83.049796),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    var pathCoords = [
        {lat: 42.329638, lng: -83.049796},
        {lat: 42.328496, lng: -83.048937}
    ];
    path = new google.maps.Polyline({
        path: pathCoords,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    path.setMap(map);
}

var socket = io();
socket.on('test', function(data) {
    var newpath = path.getPath();
    newpath.push(new google.maps.LatLng(data.lat,data.lng));
    path.setPath(newpath);
    console.log(data);

});

