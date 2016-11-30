const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
require('dotenv').config({
  silent: false,
  path: path.join(__dirname, '../.env'),
});

const express = require('express');
const morgan = require('morgan');
const requestHandlers = require('./requestHandlers.js');
const logger = require('./logger');
const bodyParser = require('body-parser');

require('./db/connection');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

/**
 * @api {get} /pathfinder
 * @apiName Pathfinder
 * @apiGroup Risk
 *
 * @apiParam {Object[]} origin A query param representing the origin of the route
 * @apiParam {string} origin.lat The latitude of the origin.
 * @apiParam {string} origin.lng The longitude of the origin.
 * @apiParam {Object[]} destination A query param representing the destination of the route
 * @apiParam {string} destination.lat The latitude of the destination.
 * @apiParam {string} destination.lng The longitude of the destination.
 *
 * @apiSuccess {Object[]} response
 * An array of objects corresponding to possible routes from the origin to the destination.
 * @apiSuccess {Object} response.route Google Maps data corresponding to the route.
 * @apiSuccess {Array[]} response[].path Latitude-longitude coordinate tuples of the pathway
 * from the origin to the destination.
 * @apiSuccess {number[]} response[].risks Risk values for each coordinate tuple
 * in `path`.
 * @apiSuccess {number} response[].maxRisk The max risk value for the route.
 * @apiSuccess {number} response[].averageRisk The average risk value for the route.
 * @apiSuccess {number} response[].totalRisk The total risk value for the route.
 * @apiSuccess {number} response[].riskWeight The risk weighting factor used to generate
 * the route.
 *
 * @apiError {Object} error Error information associated with the request.
 * @apiError {string} error.message Human-readable description of the error.
 */
app.get('/pathfinder', requestHandlers.findPath);


const port = 3002;
const sslPort = 3012;

app.listen(port, () => logger.info(`Risk service listening on ${port}`));

try {
  const options = {
    key: fs.readFileSync('/var/ssl/key.pem'),
    cert: fs.readFileSync('/var/ssl/cert.pem'),
  };

  https.createServer(options, app).listen(sslPort, () => {
    logger.info(`https server listening on ${sslPort}`);
  });
} catch (e) {
  logger.warn(`Error creating https server: ${e.message}`);
}

module.exports = app;
