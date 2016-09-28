var express = require('express'),
    app = express(),
    routes = require('./routes'),
    userRoutes = require('./users/routes'),
    mongoose = require('mongoose');

// connect to database
mongoose.connect('mongodb://localhost:27017/homeblame');

// set up routes
app.use('/api', routes);
app.use('/api/u', userRoutes);

// start server
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Express server listening on port %s.", port);
});