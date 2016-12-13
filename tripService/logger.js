const winston = require('winston');
const path = require('path');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
    }),
    new (winston.transports.File)({
      filename: path.join(__dirname, 'tripService.log'),
      colorize: false,
      json: false,
    }),
  ],
});
