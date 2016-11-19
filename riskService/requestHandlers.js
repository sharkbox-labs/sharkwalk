const assessor = require('./riskHelpers/riskAssessors');
const turf = require('@turf/turf');

const decoratePointWithRisk = function decoratePointWithRisk(point) {
  // Assert the point is well-formed
  turf.geojsonType(point, 'Point', `Invalid GeoJSON Point: ${point}`);
  return assessor.getRiskForGeoJSONPoint(point)
    .then(risk => Object.assign({}, point, { properties: { risk } }));
};

const buildRiskPromise = function buildRiskPromise(input) {
  if (Array.isArray(input) && typeof input[0] === 'number') {
    // a single coordinate
    return assessor.getRiskForCoordinates(input);
  }

  if (Array.isArray(input) && Array.isArray(input[0])) {
    // an array of coordinate arrays
    return Promise.all(input.map(coord => assessor.getRiskForCoordinates(coord)));
  }

  if (!Array.isArray(input)) {
    // a geojson object
    return decoratePointWithRisk(input);
  }

  if (Array.isArray(input) && !Array.isArray(input[0]) && typeof input[0] === 'object') {
    // an array of geojson objects
    return Promise.all(input.map(point => decoratePointWithRisk(point)));
  }
  throw new Error('Unexpected input format.');
};

const getRisk = function getRisk(request, response) {
  const input = request.body.point;
  return buildRiskPromise(input)
  .then(risk => response.status(200).json({ risk }))
  .catch(e => response.status(400).json({
    error: {
      message: e.message,
    },
  }));
};

module.exports = {
  getRisk,
};
