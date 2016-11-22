const turf = require('@turf/turf');
const riskPointController = require('../db/riskPointController');

const precisionRound = function precisionRound(number, precision) {
  const factor = Math.pow(10, precision); // eslint-disable-line no-restricted-properties
  const tempNumber = number * factor;
  const roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

/**
 * Gets the risk for a GeoJSON point.
 * @param {GeoJSON Point} point - The point to evaluate risk at.
 * @return {Promise} A promise that resolves to a number representing the risk
 * at that point.
 */
const getRiskForGeoJSONPoint = function getRiskForGeoJSONPoint(point) {
  return riskPointController.findRiskPointsNear(point, 100)
    .then((riskPoints) => {
      if (riskPoints.length === 0) {
        throw new Error(`No risk coverage near the point ${point}`);
      }
      let risk;
      riskPoints.reduce((minDist, riskPoint) => {
        const dist = turf.distance(point, riskPoint.location);
        if (dist < minDist) {
          risk = riskPoint.risk;
          return dist;
        }
        return minDist;
      }, Infinity);
      return precisionRound(risk, 2);
    });
};

/**
 * Gets the risk for a coordinate.
 * @param {Array} coords - The points coordinates in latitude, longitude
 * format. Assumes the WGS-84 datum.
 * @return {Promise} A promise that resolves to a number representing the
 * risk at the point.
 */
const getRiskForCoordinates = function getRiskForCoordinates(coords) {
  return getRiskForGeoJSONPoint({
    type: 'Point',
    coordinates: [coords[1], coords[0]],
  });
};

module.exports = {
  getRiskForCoordinates,
  getRiskForGeoJSONPoint,
};
