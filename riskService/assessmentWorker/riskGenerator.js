const turf = require('@turf/turf');
const geoMeta = require('@turf/meta');
const sf = require('./sanFranciscoDataConnector');
const config = require('../config');

/**
 * Gives a weight according to a distance. The weight approaches
 * 1 as the distance approaches 0. The weight falls off according to a
 * function similar to the sigmoid function. At 100m the weight is 0.5
 * and at 250m the weight is less than .01. The weighting function is viewable
 * [here](https://www.desmos.com/calculator/43k6mf4kyb).
 * @param {number} distance - The distance (should be in meters) between the crime
 * and the point of interest.
 * @return {number} The weight, expressed between 0 and 1.
 */
const weightByDistance = function weightByDistance(distance) {
  return 1 - (1 / (1 + Math.exp((distance - 100) / -20)));
};

/**
 * The risk-generation algorithm. The the algorithm compares the distance between each
 * crime incident in `reports` and the `point`, and based on the distance adds some amount
 * to the risk level at the `point`. Crimes directly at the point will be assigned a level
 * of (essentially) 1. From there the risk falls off with a function that resembles the sigmoid
 * function. At 100 meters from the point crimes will add 0.5 of risk to the point, and by 250m
 * the crimes add less than .01 risk to the point. The weighting function is viewable
 * [here](https://www.desmos.com/calculator/43k6mf4kyb).
 * @param {GeoJSON Object} point - A GeoJSON point for which to get risk data.
 * @param {Object[]} reports - An array of objects representing the crime reports
 * in the area surrounding the point. This is the return value of the `fetchCrimeReports`
 * function.
 * @return {number} The risk level for the point
 *
 * @example
 * const pointOfInterest = {
 *   type: 'Feature',
 *   properties: {},
 *   geometry: {
 *     type: 'Point',
 *     coordinates: [
 *       -122.40876406431198,
 *       37.783619274969794,
 *     ],
 *   },
 * };
 *
 * const risk = generateRiskForPoint(pointOfInterest, reports);
 * // `risk` is the risk level at `pointOfInterest`
 */
const generateRiskForPoint = function generateRiskForPoint(point, reports) {
  if (!reports || !Array.isArray(reports)) {
    throw new Error('Crime reports must be included to generate risk.');
  }
  return reports.reduce((accumulatedRisk, report) => {
    const distance = turf.distance(point, report.location, 'kilometers') * 1000; // convert to meters
    if (distance > config.maxCrimeDistance) {
      return accumulatedRisk; // don't worry about points far away.
    }
    return accumulatedRisk + weightByDistance(distance);
  }, 0);
};

/**
 * Generates a grid of GeoJSON points that cover the input `area`.
 * @param {GeoJSON Object} area - The area for which to generate the risk. Generally
 * a GeoJSON point or polygon.
 * @param {number} [cellSize=0.1] - The distance across each cell.
 * @param {string} [unit='kilometers'] - The unit associated with the `cellsize`. Can
 * be degrees, radians, miles, or kilometers.
 * @return {GeoJSON[]} An array of GeoJSON points representing the grid covering the `area`.
 */
const generateGridForArea = function generateGridForArea(area, cellSize = 0.1, units = 'kilometers') {
  const bounds = turf.bbox(area);
  const pointGrid = turf.pointGrid(bounds, cellSize, units);
  return turf.within(pointGrid, area);
};

/**
 * Generates and saves a set of points with their risk numbers.
 * @param {GeoJSON Object} area - The area for which to generate the risk. Generally
 * a GeoJSON point or polygon.
 * @return {Promise} - Resolves to a GeoJSON `FeatureCollection` of grid-points inside
 * the `area`. The density of the grid is determined in the projects `config.js` file.
 * Each point is a GeoJSON object with a property `property.risk` with a value of the risk
 * at that point.
 */
const generateRiskForArea = function generateRiskForArea(area) {
  const buffer = turf.buffer(area, config.maxCrimeDistance, 'meters');
  const reportArea = turf.envelope(buffer);
  const density = config.gridDensity / 1000 || 0.1; // default to 100m if no config found
  const pointGrid = generateGridForArea(area, density, 'kilometers');
  return sf.fetchCrimeReports(reportArea, config.reportLookback)
    .then((reports) => {
      const riskValues = [];
      geoMeta.featureEach(pointGrid, (point) => {
        const risk = generateRiskForPoint(point, reports);
        riskValues.push(risk);
        // eslint-disable-next-line no-param-reassign
        point.properties.risk = risk;
      });
      riskValues.sort((a, b) => a - b);
      geoMeta.featureEach(pointGrid, (point) => {
        const riskPercentile = (riskValues.indexOf(point.properties.risk)
          / (riskValues.length - 1)) * 100;
        // eslint-disable-next-line no-param-reassign
        point.properties.risk = riskPercentile;
      });
      return pointGrid;
    });
};

module.exports = {
  generateRiskForArea,
  generateRiskForPoint,
};
