const express = require('express');
const morgan = require('morgan');
const router = require('./routes');
const path = require('path');

const app = express();

app.use(morgan('dev'));

app.use('/api', router);

app.use('/', express.static(path.join(__dirname, '../client')));

// app.use('*', () => {

// });


app.listen(3000, () => console.log('Listening on 3000'));

module.exports = app;
