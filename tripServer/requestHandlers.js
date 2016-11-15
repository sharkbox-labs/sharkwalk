const request = require('axios');


const APIKEY = process.env.APIKEY;

const googleMapsURL = 'https://maps.googleapis.com/maps/api/directions/json?origin=';

const requestHandler = (req, resp) => {
  // define origin and destination from request parameters
  // hard coded locations for now
  const origin = '37.783669,-122.40895';
  const destination = '37.781256,-122.405955';
  const directionsRequestURL = googleMapsURL + origin + '&destination=' + destination + '&mode=walking&key=' + APIKEY;
  // make call to googleMaps api with origin and destination
  request(directionsRequestURL)
  .then((route) => {
    // temporarily sending back routes array
    resp.status(200).json(route.data.routes);
  });
};

// request handler should:
  // make API request to Google Maps
  // embellish response with array of coordinates by ...
    // using helper functions (tripHelpers.js)
      // send embellished object back to integration server


module.exports = {
  requestHandler,
};


// ------------------------------------------------------------------- //

// Google Maps API Information:
// DirectionsRequest object literal contains the following fields:
// {
//   origin: LatLng | String | google.maps.Place,
//   destination: LatLng | String | google.maps.Place,
//   travelMode: TravelMode,
//   transitOptions: TransitOptions,
//   drivingOptions: DrivingOptions,
//   unitSystem: UnitSystem,
//   waypoints[]: DirectionsWaypoint,
//   optimizeWaypoints: Boolean,
//   provideRouteAlternatives: Boolean,
//   avoidHighways: Boolean,
//   avoidTolls: Boolean,
//   region: String
// }
