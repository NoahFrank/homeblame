var express = require('express');
var router = express.Router();

var userCtrl = require('./userCtrl');

router.route('/').get(userCtrl.getUsers);
router.route('/add').post(userCtrl.addUser);
router.route('/:uid').get(userCtrl.getUser);
router.route('/update/:uid').patch(userCtrl.updateUser);

module.exports = router;