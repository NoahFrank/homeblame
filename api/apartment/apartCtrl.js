var Apart = require('./apartModel');
var handleAPIError = require('../util/utils').handleAPIError;

module.exports = {

    addApart : function (req, res) {
        var newApart = new Apart();
        newApart.name = req.body.name; // TODO: Alpha-numeric only?
        newApart.dwellers.push(req.body.creator); // TODO: Validate creator resembles a username
        newApart.bathrooms.push(req.body.bathrooms); // TODO: Validate or empty
        newApart.save({}, function (err, apart) {
            if (err) handleAPIError(err, res);
            res.send(apart);
        });
    },

    getApart : function (req, res) {
        Apart.findById(req.params.uid, function (err, apart) {
            if (err) handleAPIError(err, res);
            res.send(apart);
        });
    },

    removeApart : function (req, res) {
        Apart.findByIdAndRemove({ _id: req.params.uid }, function (err, apart) {
            if (err) handleAPIError(err, res);
            res.send({"Status": "Successful"});
        });
    },

    updateApart : function (req, res) {
        Apart.findByIdAndUpdate({ _id: req.params.uid }, req.body, function (err, apart) {
            if (err) handleAPIError(err, res);
            Apart.findById(req.params.uid, function (err, apart) {
                if (err) handleAPIError(err, res);
                res.send(apart);
            })
        });
    }
};
