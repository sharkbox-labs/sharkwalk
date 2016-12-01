const path = require('path');
require('dotenv').config({
  silent: true,
  path: path.join(__dirname, '../../.env'),
});
const logger = require('../logger');
const db = require('../db/connection');

const RiskNode = require('../db/riskNodeModel');

RiskNode.remove({}).then(() => {
  logger.info('Removed all risk nodes.');
  db.close();
}).catch((error) => {
  logger.error(`Error removing risk nodes: ${error}`);
  db.close();
});
