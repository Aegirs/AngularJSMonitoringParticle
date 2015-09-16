'use strict';

var _ = require('lodash');
var Core = require('./core.model');

// Get list of cores
exports.index = function(req, res) {
  Core.find(function (err, cores) {
    if(err) { return handleError(res, err); }
    return res.json(200, cores);
  });
};

// Get a single core
exports.show = function(req, res) {
  Core.findById(req.params.id, function (err, core) {
    if(err) { return handleError(res, err); }
    if(!core) { return res.send(404); }
    return res.json(core);
  });
};

// Creates a new core in the DB.
exports.create = function(req, res) {
  Core.create(req.body, function(err, core) {
    if(err) { return handleError(res, err); }
    return res.json(201, core);
  });
};

// Updates an existing core in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Core.findById(req.params.id, function (err, core) {
    if (err) { return handleError(res, err); }
    if(!core) { return res.send(404); }
    var updated = _.merge(core, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, core);
    });
  });
};

// Deletes a core from the DB.
exports.destroy = function(req, res) {
  Core.findById(req.params.id, function (err, core) {
    if(err) { return handleError(res, err); }
    if(!core) { return res.send(404); }
    core.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}