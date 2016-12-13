const path = require('path');
const mongoose = require('mongoose');
const logger = require('../logger');
require('dotenv').config({
  silent: true,
  path: path.join(__dirname, '../../.env'),
});

mongoose.Promise = global.Promise;

let mongoURL;

if (process.env.NODE_ENV === 'production') {
  mongoURL = 'mongodb://riskdb/jellywave';
} else {
  mongoURL = process.env.MONGO_URL || 'mongodb://localhost/jellywave';
}

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', () => logger.error(`Database error on ${mongoURL}`));
db.once('open', () => logger.info(`Connected to database on ${mongoURL}`));
db.on('close', () => logger.info(`Closed connection to database on ${mongoURL}`));

module.exports = db;
