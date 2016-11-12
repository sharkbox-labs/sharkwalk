const request = require('axios');

/**
 * Fetches the crime reports from the San Francisco data set
 * @param {Object[]} bounds - An array of GeoJSON points representing the
 * northwest and southeast bounds of the area to fetch crime reports for
 * @param {string} lookback - The amount of time to lookback for reports. Natural language (i.e. '6 months ago') is accepted
 * using the [sugar.js](https://sugarjs.com/docs/#/DateParsing) library.
 * @return {Promise} A promise that resolves to an array of JSON objects representing the crimes
 */
const fetchCrimeReports = function fetchCrimeReports(bounds, lookback) {

};

module.exports = {

};
