var express = require('express');
var router = express.Router();

var userCtrl = require('./userCtrl');

router.route('/').get(userCtrl.getUsers);

module.exports = router;