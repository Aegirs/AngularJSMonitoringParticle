'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CoreSchema = new Schema({
  name: String,
  idCore: String,
  connect: Boolean
});

module.exports = mongoose.model('Core', CoreSchema);
