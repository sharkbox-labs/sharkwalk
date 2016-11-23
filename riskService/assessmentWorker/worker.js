require('dotenv').config({ silent: false });
const shortid = require('shortid');
const logger = require('../logger');
const riskGenerator = require('./riskGenerator');
const riskPointController = require('../db/riskPointController');
const db = require('../db/connection');


/**
 * Takes an area and generates the risk points within that area, saving the
 * result to the database.
 * @module worker
 * @param  {GeoJSON Feature Collection} area - A GeoJSON feature collection
 * representing the area bounds. Visit [geojson.io](http://geojson.io/) for
 * an easy GUI to create the object.
 * @return {Promise} Resolves to an array of the created records.
 */
module.exports = function worker(area, keepAlive = false) {
  const batchId = shortid.generate();
  return riskGenerator.generateRiskForArea(area)
  .then((riskPoints) => {
    logger.info(`Generated ${riskPoints.features.length} risk points`);
    return riskPointController
      .createRiskPoints(riskPoints.features.map(feature => ({
        location: feature.geometry,
        risk: feature.properties.risk,
      })), batchId);
  })
  .then((records) => {
    logger.info(`Saved ${records.length} risk points in batch ${batchId}`);
    if (!keepAlive) db.close();
    return records;
  })
  .catch((error) => {
    logger.error(`Error '${error.message}' with risk points batch ${batchId}`);
    if (!keepAlive) db.close();
    throw error;
  });
};
