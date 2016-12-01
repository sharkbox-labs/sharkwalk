const turf = require('@turf/turf');
const riskNodeController = require('../db/riskNodeController');
const config = require('../config');

/**
 * Gets the risk for a GeoJSON point.
 * @param {GeoJSON Point} point - The point to evaluate risk at.
 * @return {Promise} A promise that resolves to a number representing the risk
 * at that point.
 */
const getRiskForGeoJSONPoint = function getRiskForGeoJSONPoint(point) {
  return riskNodeController.findRiskNodesNear(point, 100)
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
      return Math.round(risk);
    });
};


const getRiskForCoordinatesArray = function getRiskForCoordinatesArray(coordArray) {
  const longLats = coordArray.map(coord => [coord[1], coord[0]]);
  const lineString = turf.lineString(longLats);
  const expandedString = turf.buffer(lineString, (config.gridDensity / 1000) * 1.05, 'kilometers');
  return riskNodeController.findRiskNodesWithinPolygon(expandedString.geometry)
    .then((records) => {
      const features = records.map(record => ({
        type: 'Feature',
        geometry: record.location,
        properties: {
          risk: record.risk,
        },
      }
      ));
      const pointsCollection = turf.featureCollection(features);
      return longLats.map((coord) => {
        // find closest point in feature collection
        const point = turf.point(coord);
        const nearest = turf.nearest(point, pointsCollection);
        const distance = turf.distance(point, nearest, 'kilometers');
        if (distance * 1000 > 250) {
          throw new Error(`No coverage near point: ${coord[1]}, ${coord[0]}.`);
        }
        return Math.round(nearest.properties.risk);
      });
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

const decoratePointWithRisk = function decoratePointWithRisk(point) {
  // Assert the point is well-formed
  turf.geojsonType(point, 'Point', `Invalid GeoJSON Point: ${point}`);
  return getRiskForGeoJSONPoint(point)
    .then(risk => Object.assign({}, point, { properties: { risk } }));
};

module.exports = {
  getRiskForCoordinates,
  getRiskForGeoJSONPoint,
  getRiskForCoordinatesArray,
  decoratePointWithRisk,
};
