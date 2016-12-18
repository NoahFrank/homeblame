var User = require('../users/userModel');
var handleAPIError = require('../util/utils').handleAPIError;
var jwt = require('jsonwebtoken');
var config = require('config');

module.exports = {
    authenticate : function (req, res) {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) handleAPIError(err, res);
            if (!user) {
                // user not found
                res.status(404);
                res.json({ success: false, message: "Authentication failed. User not found"});
            } else {
                // check password
                if (req.body.password != user.password) {
                    // passwords didn't match
                    res.status(401);
                    res.json({ success: false, message: "Authentication failed. Wrong password."});
                } else {
                    // generate jwt and return token
                    var token = jwt.sign(user, config.get('secretKey'), {});
                    res.json({ success: true, message: "Success", token: token});
                }
            }
        });
    }
};
