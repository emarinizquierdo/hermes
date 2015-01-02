/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /devices              ->  index
 * POST    /devices              ->  create
 * GET     /devices/:id          ->  show
 * PUT     /devices/:id          ->  update
 * DELETE  /devices/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Device = require('./device.model');

// Get list of devices
exports.index = function(req, res) {
  var userId = req.user._id;
  Device.find({userId : userId}, function (err, devices) {
    if(err) { return handleError(res, err); }
    return res.json(200, devices);
  });
};

// Get a single device
exports.show = function(req, res) {
  var userId = req.user._id;
  Device.find({_id : req.params.id, userId : userId}, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    return res.json(device);
  });
};

// Creates a new device in the DB.
exports.create = function(req, res) {
  req.body.userId = req.user._id;
  Device.create(req.body, function(err, device) {
    if(err) { return handleError(res, err); }
    return res.json(201, device);
  });
};

// Updates an existing device in the DB.
exports.update = function(req, res) {
  var userId = req.user._id;
  if(req.body._id) { delete req.body._id; }
  Device.find({_id : req.params.id, userId : userId}, function (err, device) {
    if (err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    var updated = _.merge(device, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, device);
    });
  });
};

// Deletes a device from the DB.
exports.destroy = function(req, res) {
  var userId = req.user._id;
  Device.findOneAndRemove({ _id : req.params.id, userId : userId}, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    return res.send(204);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}