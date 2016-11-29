const express = require('express');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
// const config = require('./config/maps');
const requestHandler = require('./requestHandlers.js').requestHandler;

const app = express();

app.use(bodyParser.json());

app.post('/routes', requestHandler);

const port = 3001;

app.listen(port, () => {
  console.log('listening on port 3001...');
});

module.exports = app;
