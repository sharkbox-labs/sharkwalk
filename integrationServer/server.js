const express = require('express');
const router = require('./routes');
const path = require('path');

const app = express();



app.listen(3000, () => console.log('Listening on 3000'));

module.exports = app;
