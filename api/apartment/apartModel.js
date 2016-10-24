// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var apartSchema = new Schema({
    name: String,
    shoppingList: { type: Schema.Types.ObjectId, ref: 'ShoppingList' },
    events: [{ type: Schema.Types.ObjectId, ref: 'Events' }],
    dwellers: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    scapegoats: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    utilities: [{ type: Schema.Types.ObjectId, ref: 'Utility' }],
    bathrooms: [{ type: Schema.Types.ObjectId, ref: 'Bathroom' }],
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', apartSchema);

// make this available to our users in our Node applications
module.exports = User;