var User = require('./userModel');

module.exports = {
    getUsers : function (req, res) {
        User.find({} , function (err, users) {
            if (err) handleError(err, res);
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
            if (err) handleError(err, res);
            res.send(user);
        });
    },

    removeUser : function (req, res) {
        // TODO
    },

    updateUser : function (req, res) {
        User.findByIdAndUpdate({ _id: req.params.uid }, req.body, function (err, user) {
            if (err) handleError(err, res);
            User.findById(req.params.uid, function (err, user) {
                if (err) handleError(err, res);
                res.send(user);
            })
        });
    },

    getUser : function (req, res) {
        User.findById(req.params.uid, function (err, user) {
            if (err) handleError(err, res);
            res.send(user);
        });
    }

};

function handleError(err, res) {
    var errorMsg = {errorCode: err.code, message: "Unknown Error"};
    var status = 500; // Internal Server Error
    if (err.code == 11000) { // Duplicate key error code
        status = 409; // Conflict HTTP error code
        errorMsg.message = "User with the email: " +res.req.body.email+ " already exists";
    }
    return res.status(status).send(errorMsg);
}