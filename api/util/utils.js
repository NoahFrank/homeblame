module.exports = {
    handleAPIError : function (err, res) {
        var errorMsg = {errorCode: err.code, message: "Unknown Error"};
        var status = 500; // Internal Server Error
        if (err.code == 11000) { // Duplicate key error code
            status = 409; // Conflict HTTP error code
            errorMsg.message = "User with the email: " +res.req.body.email+ " already exists";
        }
        return res.status(status).send(errorMsg);
    }
};