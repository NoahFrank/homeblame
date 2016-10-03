var express = require('express'),
    app = express(),
    healthRoutes = require('./health/routes'),
    userRoutes = require('./users/routes'),
    mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/homeblame');

// set up routes
app.use('/api/u', userRoutes);
app.use('/api/health', healthRoutes);

// start server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Express server listening on port %s.", port);
});