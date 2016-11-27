const path = require('path');
const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config({
  silent: true,
  path: path.join(__dirname, '../../.env'),
});

mongoose.Promise = global.Promise;

const mongoURL = process.env.MONGO_URL;

if (!mongoURL) {
  logger.error('No MONGO_URL enviroment variable specified.');
  throw new Error('No MONGO_URL enviroment variable specified.');
}

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', () => logger.error(`Database error on ${mongoURL}`));
db.once('open', () => logger.info(`Connected to database on ${mongoURL}`));
db.on('close', () => logger.info(`Closed connection to database on ${mongoURL}`));

module.exports = db;
