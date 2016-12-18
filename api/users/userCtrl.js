var isObject = require('lodash').isObject;
var isNull = require('lodash').isNull;

var User = require('./userModel');
var handleAPIError = require('../util/utils').handleAPIError;
var validateMongoId = require('../util/utils').validateMongoId;
var handleDoesNotExist = require('../util/utils').handleDoesNotExist;

module.exports = {
    getUsers: function (req, res) {
        User.find({}, function (err, users) {
            if (err) return handleAPIError(err, res);
            res.send(users);
        });
    },

    addUser: function (req, res) {
        var newUser = new User();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save({}, function (err, user) {
            if (err) return handleAPIError(err, res);
            res.send(user);
        });
    },

    removeUser: function (req, res) {
        if (validateMongoId(req.params.uid)) { // Make sure id is valid
            User.findByIdAndRemove({_id: req.params.uid}, function (err, user) {
                if (err) return handleAPIError(err, res);
                res.send({"Status": "Successful"});
            });
        } else {
            handleDoesNotExist(res, "User ID")
        }
    },

    updateUser: function (req, res) {
        if (validateMongoId(req.params.uid)) { // Make sure id is valid
            User.findByIdAndUpdate({_id: req.params.uid}, req.body, {new: true}, function (err, user) {
                isNull(err) && isNull(user) ?
                    handleDoesNotExist(res, "User ID") :
                    res.send(user);
            });
        } else {
            handleDoesNotExist(res, "User ID")
        }
    },

    getUser: function (req, res) {
        if (validateMongoId(req.params.uid)) { // Make sure id is valid
            User.findById(req.params.uid, function (err, user) {
                if (err) return handleAPIError(err, res);
                isObject(user) ?
                    res.send(user) :
                    handleDoesNotExist(res, "User");
            });
        } else {
            handleDoesNotExist(res, "User ID")
        }
    }
};