var express = require('express');
var helloWorldCtrl = require('./health/controllers/health');
var router = express.Router();

// Health Endpoint
router.route('/health').get(helloWorldCtrl.helloWorld);

module.exports = router;