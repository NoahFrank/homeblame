var User = require('./userModel');

module.exports = {
    getUsers : function (req, res) {
        User.find({} , function (err, users) {
            if (err) throw next();

            res.send(users);
        });
    },

    addUser : function (req, res) {
        // do stuff
        
    }
}