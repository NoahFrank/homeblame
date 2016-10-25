var express = require('express'),
    app = express(),
    healthRoutes = require('./health/routes'),
    userRoutes = require('./users/routes'),
    apartRoutes = require('./apartment/routes'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    config = require('config');

// connect to database
mongoose.connect(config.get('DBHost'));

// Middleware for parsing input
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set up routes
app.use('/api/u', userRoutes);
app.use('/api/a', apartRoutes);
app.use('/api/health', healthRoutes);

// start server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Express server listening on port %s.", port);
});

module.exports = server;
