const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const path = require('path');

const app = express();

app.use(morgan('dev'));

// To handle CORS
app.use(cors());

app.use('/', express.static(path.join(__dirname, '../client/build')));

app.use('/api', routes);

const port = 3000;

app.listen(port, () => console.log(`Integration server listening on port: ${port}`));

module.exports = app;
