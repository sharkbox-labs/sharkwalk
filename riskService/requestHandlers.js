const axios = require('axios');
const assessor = require('./riskHelpers/riskAssessors');
const routeProfiler = require('./riskHelpers/routeProfiler');
const pathfinderHelpers = require('./riskHelpers/pathfinderHelpers');
const turf = require('@turf/turf');

const findPath = function findPath(request, response) {
  const tripServiceUrl = process.env.TRIP_SERVICE_URL;
  if (!tripServiceUrl) {
    throw new Error('No URL for the Trip Service set in TRIP_SERVICE_URL');
  }

  const origin = turf.point([+request.query.origin.lng, +request.query.origin.lat]);
  const destination = turf.point([+request.query.destination.lng, +request.query.destination.lat]);
  let rawPaths;
  return Promise.all([
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 6),
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 1),
  ])
    .then((unprocessedPaths) => {
      // check to see if the routes are the same
      let equivalent = true;
      const routeOneWaypoints = unprocessedPaths[0].waypoints;
      const routeTwoWaypoints = unprocessedPaths[1].waypoints;
      if (routeOneWaypoints.length !== routeTwoWaypoints.length) {
        equivalent = false;
      }
      if (equivalent) {
        // check to see if each item is the same
        for (let i = 0; i < routeOneWaypoints.length; i += 1) {
          if (routeOneWaypoints[i][0] !== routeTwoWaypoints[i][0] ||
            routeOneWaypoints[i][1] !== routeTwoWaypoints[i][1]) {
            equivalent = false;
            break;
          }
        }
      }
      if (equivalent) {
        // if the routes are the same only send one
        rawPaths = [unprocessedPaths[0]];
      } else {
        rawPaths = unprocessedPaths;
      }
      /*
      rawPaths.forEach((path) => {
        const coords = [path.origin, ...path.waypoints, path.destination];
        console.log('------------------------');
        coords.forEach((coord) => {
          console.log(`${coord[0]},${coord[1]}`);
        });
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log(coords.map(coord => coord.join(',')).join('/'));
      });
      console.log(JSON.stringify(rawPaths, null, 2));
      */
      return axios.post(`${tripServiceUrl}/routes`, rawPaths);
    })
    .then((tripResponse) => {
      const processedPaths = tripResponse.data;
      const risksPromises = [];
      processedPaths.forEach(route =>
        risksPromises.push(assessor.getRiskForCoordinatesArray(route.path)));
      return Promise.all(risksPromises)
        .then(riskArrays => riskArrays.map(risks => routeProfiler.profileRoute(risks)))
        .then(routes => routes.map((route, i) =>
          Object.assign(route, {
            riskWeight: rawPaths[i].riskWeight,
            distance: processedPaths[i].distance,
            duration: processedPaths[i].duration,
            googleMapsUrl: processedPaths[i].googleMapsUrl,
            path: processedPaths[i].path,
          })))
        .then(result => response.status(200).json(result))
        .catch(e => response.status(400).json({
          error: {
            message: e.message,
          },
        }));
    })
    .catch(error => response.status(400).json({
      error: {
        message: `There was an error getting risk paths: ${error.message}`,
      },
    }));
};

module.exports = {
  findPath,
  axios,
};
