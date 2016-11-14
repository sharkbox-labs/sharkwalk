const request = require('axios');
const sugar = require('sugar-date');
const turf = require('@turf/turf');

const sfCrimeURL = 'https://data.sfgov.org/resource/cuks-n6tp.json';

/**
 * Fetches the crime reports from the San Francisco data set
 * @param {GeoJSON Object} bounds - An GeoJSON polygon representing the bounding
 * square in which to fetch the crime data.
 * @param {string} lookback='6 months ago' - The amount of time to lookback for reports.
 * Natural language (i.e. '1 year ago') is accepted
 * using the [sugar.js](https://sugarjs.com/docs/#/DateParsing) library.
 * @param {number} limit=null - The maximum number of search results to return.
 * @return {Promise} A promise that resolves to an array of JSON objects representing the crimes
 *
 * @example
 *  const bounds = {
 *    type: 'FeatureCollection',
 *    features: [
 *      {
 *        type: 'Feature',
 *        properties: {},
 *        geometry: {
 *          type: 'Polygon',
 *          coordinates: [
 *            [
 *              [
 *                -122.41803646087645,
 *                37.78126410541595,
 *              ],
 *              [
 *                -122.41803646087645,
 *                37.7975770425844,
 *              ],
 *              [
 *                -122.39576339721678,
 *                37.7975770425844,
 *              ],
 *              [
 *                -122.39576339721678,
 *                37.78126410541595,
 *              ],
 *              [
 *                -122.41803646087645,
 *                37.78126410541595,
 *              ],
 *            ],
 *          ],
 *        },
 *      },
 *    ],
 *  };
 * fetchCrimeReports(bounds, '2 weeks ago', 50)
 *   .then((reports) => { // do something with reports // });
 */
const fetchCrimeReports = function fetchCrimeReports(bounds, lookback, limit = null) {
  const sinceDate = (lookback ? sugar.Date(lookback) : sugar.Date('6 months ago'))
    .format('{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{ms}');

  const envelope = turf.envelope(bounds);
  let minX;
  let minY;
  let maxX;
  let maxY;
  [minX, minY, maxX, maxY] = turf.bbox(envelope); // eslint-disable-line prefer-const
  return request(sfCrimeURL, {
    params: {
      $where: `x >= ${minX} and x <= ${maxX} and y >= ${minY} and y <= ${maxY} and date > '${sinceDate}'`,
      $limit: limit,
    },
  })
  .then(response => response.data);
};

module.exports = {
  fetchCrimeReports,
};
