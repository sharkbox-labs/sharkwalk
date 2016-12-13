const turf = require('@turf/turf');
const axios = require('axios');
const assessor = require('./riskHelpers/riskAssessors');
const routeProfiler = require('./riskHelpers/routeProfiler');
const pathfinderHelpers = require('./riskHelpers/pathfinderHelpers');
const errors = require('./riskErrors');
const logger = require('./logger');

const findPath = function findPath(request, response) {
  let tripServiceUrl;
  if (process.env.NODE_ENV === 'production') {
    tripServiceUrl = 'http://tripservice:3001';
  } else {
    tripServiceUrl = process.env.TRIP_SERVICE_URL || 'http://localhost:3001';
  }
  if (!tripServiceUrl) {
    throw new Error('No URL for the Trip Service set.');
  }
  if (!request.query.origin || !request.query.origin.lat || !request.query.origin.lng) {
    return response.status(400).send({
      error: {
        code: errors.noOrigin,
        message: 'Request to /pathfinder requires an origin with a lat and lng',
      },
    });
  }
  if (!request.query.destination ||
    !request.query.destination.lat || !request.query.destination.lng) {
    return response.status(400).send({
      error: {
        code: errors.noDestination,
        message: 'Request to /pathfinder requires a destination with a lat and lng',
      },
    });
  }
  const origin = turf.point([+request.query.origin.lng, +request.query.origin.lat]);
  const destination = turf.point([+request.query.destination.lng, +request.query.destination.lat]);
  let rawPaths;
  return Promise.all([
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 10),
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 1),
  ])
    .catch((error) => {
      logger.error(error);
      return response.status(400).send({
        error: {
          code: errors.noCoverage,
          message: 'The application currently does not support directions in the requested area',
        },
      });
    })
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
      if (process.env.NODE_ENV === 'debug') {
        /* eslint-disable no-console */
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
        /* eslint-enable no-console */
      }
      return axios.post(`${tripServiceUrl}/routes`, rawPaths);
    })
    .catch((error) => {
      logger.error(`Error from Trip Service: ${error}`);
      return response.status(400).send({
        error: {
          code: errors.tripServiceError,
          message: 'There was an error getting data from the trip service',
        },
      });
    })
    .then((tripResponse) => {
      const processedPaths = tripResponse.data;
      const risksPromises = [];
      processedPaths.forEach(route =>
        risksPromises.push(assessor.getRiskForCoordinatesArray(route.path)));
      return Promise.all(risksPromises)
        .catch((error) => {
          logger.error(`Error getting risks for coordinates: ${error}`);
          return response.status(400).send({
            error: {
              code: errors.noCoverage,
              message: 'The application currently does not support directions in the requested area',
            },
          });
        })
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
        .catch((error) => {
          logger.error(`There was an error profiling routes: ${error}`);
          return response.status(400).send({
            error: {
              code: errors.unknown,
              message: 'There was an error assessing the routes.',
            },
          });
        });
    });
};

module.exports = {
  findPath,
  axios,
};
