var http = require("http");

var GoogleMapsAPI = require("googlemaps");

var GMConfig = {
  key: 'AIzaSyDKhaT8Jh07EhiDy3n-w9LWiCzwSRXGXJQ',
  stagger_time:       1000, // for elevationPath 
  encode_polylines:   false,
  secure:             true, // use https 
};

var gmAPI = new GoogleMapsAPI(GMConfig);

var params = {
  center: '1 Washington Blvd Detroit MI 48226 United States',
  zoom: 15,
  size: '500x400',
  maptype: 'roadmap',
  style: [
    {
      feature: 'road',
      element: 'all',
      rules: {
        hue: '0x00ff00'
      }
    }
  ],
  path: [
    {
      color: '0x0000ff',
      weight: '5',
      points: [
        '42.329638,-83.049796',
        '42.328496,-83.048937'
      ]
    }
  ]
};

http.createServer(function (request, response) {

   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end(gmAPI.staticMap(params));
}).listen(8080);

// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');