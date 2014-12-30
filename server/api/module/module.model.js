'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModuleSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    moduleDirectiveName: String,
    configuration: String,
});

module.exports = mongoose.model('Module', ModuleSchema);
