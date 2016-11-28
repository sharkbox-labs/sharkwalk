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
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 2),
    pathfinderHelpers.findPathwayAroundRiskWeight(origin.geometry, destination.geometry, 10),
  ])
    .then((unprocessedPaths) => {
      if (JSON.stringify(unprocessedPaths[0]) === JSON.stringify(unprocessedPaths[1])) {
        rawPaths = unprocessedPaths[0];
      } else {
        rawPaths = unprocessedPaths;
      }
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
            route: processedPaths[i].route,
            path: processedPaths[i].path,
          })))
        .then(result => response.status(200).json(result))
        .catch(e => response.status(400).json({
          error: {
            message: e.message,
          },
        }));
    });
};

module.exports = {
  findPath,
  axios,
};
