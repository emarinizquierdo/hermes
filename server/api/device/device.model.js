'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    clientID: String,
    secret: String,
    name: String,
    topics: []
});

module.exports = mongoose.model('Device', DeviceSchema);
