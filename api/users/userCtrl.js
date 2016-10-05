var isObject = require('lodash').isObject;

var User = require('./userModel');
var handleAPIError = require('../util/utils').handleAPIError;

module.exports = {
    getUsers : function (req, res) {
        User.find({} , function (err, users) {
            if (err) handleAPIError(err, res);
            res.send(users);
        });
    },

    addUser : function (req, res) {
        var newUser = new User();
        newUser.firstName = req.body.firstName;
        newUser.lastName = req.body.lastName;
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        newUser.save({}, function (err, user) {
            if (err) handleAPIError(err, res);
            res.send(user);
        });
    },

    removeUser : function (req, res) {
        User.findByIdAndRemove({ _id: req.params.uid }, function (err, user) {
          if (err) res.send({"error": err});
          res.send({"Status": "Successful"});
        });
    },

    updateUser : function (req, res) {
        User.findByIdAndUpdate({ _id: req.params.uid }, req.body, function (err, user) {
            if (err) handleAPIError(err, res);
            User.findById(req.params.uid, function (err, user) {
                if (err) handleAPIError(err, res);
                res.send(user);
            })
        });
    },

    getUser: function (req, res) {
        User.findById(req.params.uid, function (err, user) {
            if (err) handleAPIError(err, res);
            isObject(user) ?
                res.send(user) :
                res.status(404).send({errorCode: 404, message: "User does not exist"});
        });
    }

};