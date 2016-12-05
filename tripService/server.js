const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const requestHandler = require('./requestHandlers.js').requestHandler;
const logger = require('./logger');

const app = express();

app.use(bodyParser.json());

app.use(morgan('dev'));

app.post('/routes', requestHandler);

app.use('/logs', express.static(path.join(__dirname, 'tripService.log')));

const port = 3001;

app.listen(port, () => logger.info(`Trip service listening on ${port}`));

module.exports = app;
