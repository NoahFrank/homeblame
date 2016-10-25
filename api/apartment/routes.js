var express = require('express');
var router = express.Router();

var apartCtrl = require('./apartCtrl');

router.route('/add').post(apartCtrl.addApart);

// specific user interactions
router.route('/:uid').get(apartCtrl.getApart);
router.route('/update/:uid').patch(apartCtrl.updateApart);
router.route('/remove/:uid').delete(apartCtrl.removeApart);

module.exports = router;
