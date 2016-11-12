const express = require('express');
const requestHandlers = require('./requestHandlers');

const router = express.Router();

router.get('/', requestHandlers);

module.exports = router;
