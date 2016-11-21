const axios = require('axios');
const getPath = require('./tripHelpers.js').getPath;


const APIKEY = process.env.APIKEY;

const requestHandler = (request, response) => {
  // define origin and destination from request parameters
  const origin = `${request.query.origin.lat.toString()},${request.query.origin.lng.toString()}`;
  const destination = `${request.query.destination.lat.toString()},${request.query.destination.lng.toString()}`;
  const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
  // make call to googleMaps api with origin and destination
  axios.get(googleMapsRequestURL, {
    params: {
      origin,
      destination,
      mode: 'walking',
      key: APIKEY,
    },
  })
  .then((route) => {
    const path = getPath(route.data);
    // repsonse object contains google directions and coordinates
    response.status(200).json({ route: route.data, path });
  })
  .catch((error) => {
    console.log(error);
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
