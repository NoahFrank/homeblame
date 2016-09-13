var express = require('express'),
    app = express(),
    crypto = require('crypto'),
    MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/homeblame", function(err, db) {

    app.get('/api/health', function(req, res) {
        return res.send("API Passed Health Check");
    });

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log("Express server listening on port %s.", port);
    });
});