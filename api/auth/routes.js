var express = require('express');
var router = express.Router();

var authCtrl = require('./authCtrl');

router.route('/').post(authCtrl.authenticate);

module.exports = router;
