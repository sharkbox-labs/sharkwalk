const axios = require('axios');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '/.env') });
const getPaths = require('./tripHelpers.js').getPaths;
const getWayPoints = require('./tripHelpers.js').getWayPoints;

const APIKEY = process.env.APIKEY;

const requestRoutes = (origin, destination, waypoint = null) => {
  const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
  // const params = {
  //   origin,
  //   destination,
  //   mode: 'walking',
  //   key: APIKEY,
  //   alternatives: true,
  //   waypoints: waypoint ? [{ location: waypoint, stopover: false }] : null,
  // };
  return axios.get(googleMapsRequestURL, {
    params: {
      origin,
      destination,
      mode: 'walking',
      key: APIKEY,
      alternatives: true,
      waypoints: waypoint ? [{ location: waypoint, stopover: false }] : null,
    },
  })
  .then(response => response.data);
};

const requestHandler = (request, response) => {
  // define origin and destination from request parameters
  const origin = `${request.query.origin.lat.toString()},${request.query.origin.lng.toString()}`;
  const destination = `${request.query.destination.lat.toString()},${request.query.destination.lng.toString()}`;
  // const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
  // make call to googleMaps api with origin and destination


  requestRoutes(origin, destination)
  .then((directionsObj) => {
    const originObj = directionsObj.routes[0].legs[0].start_location;
    const destinationObj = directionsObj.routes[0].legs[0].end_location;
    const [waypoint1, waypoint2] = getWayPoints([originObj.lat, originObj.lng],
                                                [destinationObj.lat, destinationObj.lng]);
    return Promise.all([
      requestRoutes(origin, destination, waypoint1),
      requestRoutes(origin, destination, waypoint2),
      directionsObj,
    ]);
  }).then(routesObjectArray => routesObjectArray.map(routesObject => {
    const paths = getPaths(routesObject.routes);
    const responseArray = [];
    for (let i = 0; i < routesObjectArray.length; i += 1) {
      responseArray.push({ route: routesObjectArray[i], path: paths[i] });
    }
    response.status(200).json(responseArray);
  }))
  .catch((error) => {
    console.log(error);
    return response.status(400).json({ error: { message: `There was an error getting directions: ${error.message}.` } });
  });


  // axios.get(googleMapsRequestURL, {
  //   params: {
  //     origin,
  //     destination,
  //     mode: 'walking',
  //     key: APIKEY,
  //     alternatives: true, // send back alternatve routes
  //   },
  // })
  // .then((route) => {
  //   const paths = getPaths(route.data.routes);
  //   // repsonse object contains google directions and coordinates

  //   response.status(200).json({ route: route.data, paths });
  // })
  // .catch((error) => {
  //   console.log(error);
  //   response.status(400).json({ error: { message: `There was an error getting directions: ${error.message}.` } });
  // });
};


// const getOffsetRoutes = (origin, destination) => {
//   const promises = [];
//   const waypoints = getWayPoints(origin, destination);
//   // promises.push(requestRoutes(origin, destination));
//   promises.push(requestRoutes(origin, destination, waypoints[0]));
//   promises.push(requestRoutes(origin, destination, waypoints[1]));
//   return Promise.all(promises);
// };

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
