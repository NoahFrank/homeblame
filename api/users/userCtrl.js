var User = require('./userModel');

module.exports = {
    getUsers : function (req, res) {
        User.find({} , function (err, users) {
            if (err) res.send({"error": err});
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
            if (err) res.send({"error": err});
            res.send(user);
        });
    },

    getUser : function (req, res) {
        User.findById(req.params.uid, function (err, user) {
            if (err) res.send({"error": err});
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
            if (err) res.send({"error": err});
            User.findById(req.params.uid, function (err, user) {
                if (err) res.send({"error": err});
                res.send(user);
            })
        });
    }
};
