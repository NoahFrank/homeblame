module.exports = {

    handleAPIError : function (err, res) {
        // TODO: Handle missing user argument error
        var errorMsg = {errorCode: 500, message: "Unknown Error"}; // Internal Server Error
        if (err.code == 11000) { // Duplicate key error code
            errorMsg.errorCode = 409; // Conflict HTTP error code
            // TODO: Specific to User module, but not a problem yet because only User has unique state
            errorMsg.message = "User with the email: " +res.req.body.email+ " already exists";
        }
        return res.status(errorMsg.errorCode).send(errorMsg);
    },

    handleDoesNotExist : function (res, context) {
        return res.status(404).send({errorCode: 404, message: context + " does not exist."});
    },

    validateMongoId : function (id) {
        return id.match(/^[0-9a-f]{24}$/);
    }
};