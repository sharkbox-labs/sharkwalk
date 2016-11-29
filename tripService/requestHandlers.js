const axios = require('axios');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });
const getPaths = require('./tripHelpers.js').getPaths;
const APIKEY = process.env.APIKEY;

/**
 * requests directions from google maps API
 * @param  {String || number} origin - starting point of directions
 * @param  {String || number} destination - ending point of directions
 * @param  {number[]} waypoints - array of LatLng tuples
 * @return {Promise} resolves to the google response body for directions request
 */
const requestRoutes = (origin, destination, waypoints) => {
  const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
  return axios.get(googleMapsRequestURL, {
    params: {
      origin,
      destination,
      mode: 'walking',
      key: APIKEY,
      waypoints,
    },
  })
  .then(response => response.data)
  .catch(error => console.log(error, `error requesting Route with origin ${origin}, and destination ${destination}`));
};


const requestHandler = (request, response) => {
  const promises = request.body.map((route) => {
    const origin = route.origin.join(',');
    const destination = route.destination.join(',');
    const waypoints = route.waypoints.map(waypoint => `via: + ${waypoint.join(',')}`).join('|');
    return requestRoutes(origin, destination, waypoints);
  });
  return Promise.all(promises)
  .then(directionsObjs => directionsObjs.map(directionObject => directionObject.routes))
  .then(routeArraysArray =>
    routeArraysArray.reduce((flattenedArray, routeArray) => [...flattenedArray, ...routeArray], []))
  .then((flatArray) => {
    const paths = getPaths(flatArray);
    return flatArray.map((route, i) => ({
      route,
      path: paths[i],
    }));
  })
  .then(responseArray => response.status(200).json(responseArray))
  .catch(error => response.status(400).json({ error: { message: `There was an error getting directions: ${error.message}.` } }));
};


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
