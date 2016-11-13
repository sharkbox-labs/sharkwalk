const express = require('express');
const requestHandlers = require('./requestHandlers');

const router = express.Router();

router.get('/trip', requestHandlers);

module.exports = router;
