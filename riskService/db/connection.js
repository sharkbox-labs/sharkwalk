const mongoose = require('mongoose');
const logger = require('../logger');

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost/jellywave';

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('error', () => logger.error(`Database error on ${mongoURL}`));
db.once('open', () => logger.info(`Connected to database on ${mongoURL}`));

module.exports = db;
