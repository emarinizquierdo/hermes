/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /modules              ->  index
 * POST    /modules              ->  create
 * GET     /modules/:id          ->  show
 * PUT     /modules/:id          ->  update
 * DELETE  /modules/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Module = require('./module.model');

// Get list of modules
exports.index = function(req, res) {
    Module.find(function(err, modules) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, modules);
    });
};

// Get a single module
exports.show = function(req, res) {
    var userId = req.user._id;
    Module.find({
        _id: req.params.id,
        userId: userId
    }, function(err, module) {
        if (err) {
            return handleError(res, err);
        }
        if (!module) {
            return res.send(404);
        }
        return res.json(module);
    });
};

// Creates a new module in the DB.
exports.create = function(req, res) {
    req.body.userId = req.user._id;
    Module.create(req.body, function(err, module) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, module);
    });
};

// Updates an existing module in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Module.findById(req.params.id, function(err, module) {
        if (err) {
            return handleError(res, err);
        }
        if (!module) {
            return res.send(404);
        }
        var updated = _.merge(module, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, module);
        });
    });
};

// Deletes a module from the DB.
exports.destroy = function(req, res) {
    Module.findById(req.params.id, function(err, module) {
        if (err) {
            return handleError(res, err);
        }
        if (!module) {
            return res.send(404);
        }
        module.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
