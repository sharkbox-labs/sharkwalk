const request = require('axios');
const sugar = require('sugar-date');

const sfCrimeURL = 'https://data.sfgov.org/resource/cuks-n6tp.json';

/**
 * Fetches the crime reports from the San Francisco data set
 * @param {Object[]} bounds - An array of GeoJSON points representing the
 * northwest and southeast bounds of the area to fetch crime reports for
 * @param {string} lookback='6 months ago' - The amount of time to lookback for reports.
 * Natural language (i.e. '1 year ago') is accepted
 * using the [sugar.js](https://sugarjs.com/docs/#/DateParsing) library.
 * @param {number} limit=null - The maximum number of search results to return.
 * @return {Promise} A promise that resolves to an array of JSON objects representing the crimes
 *
 * @example
 * const bounds = [
 *   {
 *     geometry: {
 *       type: 'Point',
 *       coordinates: [-122.4204826, 37.7963668],
 *     },
 *   },
 *   {
 *     geometry: {
 *       type: 'Point',
 *       coordinates: [-122.3955917, 37.7804946],
 *     },
 *   },
 * ];
 * fetchCrimeReports(bounds, '2 weeks ago', 50)
 *   .then((reports) => { // do something with reports // });
 */
const fetchCrimeReports = function fetchCrimeReports(bounds, lookback, limit = null) {
  const sinceDate = (lookback ? sugar.Date(lookback) : sugar.Date('6 months ago'))
    .format('{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{ms}');
  const minX = Math.min(bounds[0].geometry.coordinates[0], bounds[1].geometry.coordinates[0]);
  const maxX = Math.max(bounds[0].geometry.coordinates[0], bounds[1].geometry.coordinates[0]);
  const minY = Math.min(bounds[0].geometry.coordinates[1], bounds[1].geometry.coordinates[1]);
  const maxY = Math.max(bounds[0].geometry.coordinates[1], bounds[1].geometry.coordinates[1]);
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
