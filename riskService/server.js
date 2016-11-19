require('dotenv').config({
  silent: true,
  path: './.env',
});

const express = require('express');
const morgan = require('morgan');
const requestHandlers = require('./requestHandlers.js');
const logger = require('./logger');
const bodyParser = require('body-parser');

require('./db/connection');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

/**
 * @api {post} /risk
 * @apiName GetRisk
 * @apiGroup Risk
 *
 * @apiParam {Array || Array[] || GeoJSON Point || GeoJSON Point[]} point
 * The point(s) the requester would like risk assessed for. If the point
 * cooridinates are in Array format, they must be [latitude, longitude]. The endpoint can
 * accept a single point, or an array of points. The endpoint is also capable of
 * handling a single GeoJSON point or an array of GeoJSON points.
 *
 * @apiSuccess {number || number[] || GeoJSON Point || GeoJSON Point[]} risk
 * The risk level associated with the input. If the input param is a coordinate array
 * or an array of coordinate arrays the output will be a single number or an array
 * of numbers. If the input is a GeoJSON Point or an array of GeoJSON points, then
 * the endpoint will add a `risk` property to the GeoJSON `property` object and set
 * its value to the risk at that point.
 *
 * @apiError {Object} error Error information associated with the request.
 * @apiError {string} error.message Human-readable description of the error.
 */
app.post('/risk', requestHandlers.getRisk);

const port = 3002;

app.listen(port, () => logger.info(`Risk service listening on ${port}`));

module.exports = app;
