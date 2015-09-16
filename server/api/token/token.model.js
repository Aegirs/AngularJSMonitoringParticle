'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TokenSchema = new Schema({
  client: String,
  expires_at: String,
  token: String
});

module.exports = mongoose.model('Token', TokenSchema);
