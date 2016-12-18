var express = require('express');
var router = express.Router();
var isAuthenticated = require('../util/utils').isAuthenticated;

var userCtrl = require('./userCtrl');

router.route('/').get(userCtrl.getUsers);
router.route('/add').post(userCtrl.addUser);

// specific user interactions
router.route('/:uid').get(userCtrl.getUser);
router.route('/update/:uid').patch(userCtrl.updateUser);
router.route('/remove/:uid').delete(userCtrl.removeUser);

module.exports = router;
