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
 *   .then((reports) => { console.log(reports) });
 * // outputs:
 * [
 *   {
 *     address: 'SACRAMENTO ST / JOICE ST',
 *     category: 'LARCENY/THEFT',
 *     date: '2016-10-15T00:00:00.000',
 *     dayofweek: 'Saturday',
 *     descript: 'GRAND THEFT FROM LOCKED AUTO',
 *     incidntnum: '166234434',
 *     location: { type: 'Point', coordinates: [ -122.396382, 37.781749 ] },
 *     pddistrict: 'CENTRAL',
 *     pdid: '16623443406244',
 *     resolution: 'NONE',
 *     time: '14:00',
 *     x: '-122.408547479638',
 *     y: '37.7930734224606'
 *   },
 *   {
 *     address: 'MISSION ST / 4TH ST',
 *     category: 'LARCENY/THEFT',
 *     date: '2016-10-15T00:00:00.000',
 *     dayofweek: 'Saturday',
 *     descript: 'PETTY THEFT OF PROPERTY',
 *     incidntnum: '166233925',
 *     location: { type: 'Point', coordinates: [ -122.40427, 37.784479 ] },
 *     pddistrict: 'SOUTHERN',
 *     pdid: '16623392506372',
 *     resolution: 'NONE',
 *     time: '15:30',
 *     x: '-122.404270179486',
 *     y: '37.7844788538745'
 *   }
 * ]
 */
const fetchCrimeReports = function fetchCrimeReports(
  bounds,
  lookback,
  limit = 50000, // 50000 is the max the API will return
  results = [],
  offset = 0) {
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
      $where: `x >= ${minX} and x <= ${maxX} and y >= ${minY} and y <= ${maxY} and date > '${sinceDate}' and category != 'NON-CRIMINAL'`,
      $limit: limit,
      $select: 'category, time, date, descript, location',
      $offset: offset,
    },
  })
  .then((response) => {
    const newResults = [...results, ...response.data];
    if (response.data.length === limit && limit === 50000) {
      // We are at our max number of records and need to paginate
      console.log(`Retrieved the limit of ${limit} records. Paginating.`);
      return fetchCrimeReports(bounds, lookback, limit, newResults, offset + limit);
    }
    console.log(`Retrieved ${newResults.length} records.`);
    return newResults;
  });
};

module.exports = {
  fetchCrimeReports,
  request,
};
