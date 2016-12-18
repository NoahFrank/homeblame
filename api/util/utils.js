var jwt = require('jsonwebtoken');
var config = require('config');

module.exports = {
    handleAPIError : function (err, res) {
        // TODO: Handle missing user argument error
        var errorMsg = {errorCode: 500, message: "Unknown Error"}; // Internal Server Error
        if (err.code == 11000) { // Duplicate key error code
            errorMsg.errorCode = 409; // Conflict HTTP error code
            errorMsg.message = "User with the email: " +res.req.body.email+ " already exists";
        }
        return res.status(errorMsg.errorCode).send(errorMsg);
    },

    isAuthenticated : function (req, res, next) {
        var headers = req.headers;
        var authToken = headers['authenticated'];

        var decodedToken = jwt.verify(authToken, config.get('secretKey'));

        return next();
    }
};