var express = require('express');
var router = express.Router();

var healthCtrl = require('./healthCtrl');

router.route('/').get(healthCtrl.helloWorld);

module.exports = router;