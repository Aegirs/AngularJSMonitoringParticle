/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Core = require('./core.model');

exports.register = function(socket) {
  Core.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Core.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('core:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('core:remove', doc);
}