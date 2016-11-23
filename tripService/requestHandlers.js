const axios = require('axios');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });
const getPaths = require('./tripHelpers.js').getPaths;
const getWayPoints = require('./tripHelpers.js').getWayPoints;

const APIKEY = process.env.APIKEY;

/**
 * requests directions from google maps API
 * @param  {String || number} origin - starting point of directions
 * @param  {String || number} destination - ending point of directions
 * @param  {number[]} [waypoint=null] - LatLng tuple
 * @return {Promise} resolves to the google response body for directions request
 */
const requestRoutes = (origin, destination, waypoint = null) => {
  const googleMapsRequestURL = 'https://maps.googleapis.com/maps/api/directions/json?';
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

  return requestRoutes(origin, destination)
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
  })
  .then(directionsObjects => directionsObjects.map(directionObject => directionObject.routes))
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
