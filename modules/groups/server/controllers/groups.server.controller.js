'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Group = mongoose.model('Group'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a group
 */
exports.create = function (req, res) {
  var group = new Group(req.body);
  group.user = req.user;
  
  group.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group);
    }
  });
};

/**
 * Show the current group
 */
exports.read = function (req, res) {
  res.json(req.group);
};

/**
 * Update a group
 */
exports.update = function (req, res) {
  var group = req.group;

  group.name = req.body.name;
  group.category = req.body.category;

  group.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group);
    }
  });
};

/**
 * Delete an group
 */
exports.delete = function (req, res) {
  var group = req.group;

  group.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(group);
    }
  });
};

/**
 * List of groups
 */
exports.list = function (req, res) {

  var user = req.user;

  var query = Group.find();

  var filter ="{'user': {'$in' : [user._id]}}"; 
  for (var i = 0; i < user.roles.length; i++) {
    if (user.roles[i]!=='admin')
    {
      query.where('user').equals(user._id);
    }
  }
  query.sort('-created')
  .populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(groups);
    }
  });    



/*  Group.find().sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(groups);
    }
  });
*/
};

exports.listByUser = function (req, res, id) {
  Group.find({'user' : {'$in' : [id]} }).sort('-created').populate('user', 'displayName').exec(function (err, groups) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(groups);
    }
  });
};

/*exports.findByGroupID = function(req, res, next, id) { 
  console.log('inside findByGroupID');
  Person.find({'groups' : {'$in' : [id]} }).populate('user', 'displayName').exec(function(err, people) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(people);
    }
  });
};
*/

/**
 * group middleware
 */
exports.groupByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'group is invalid'
    });
  }

  Group.findById(id).populate('user', 'displayName').exec(function (err, group) {
    if (err) {
      return next(err);
    } else if (!group) {
      return res.status(404).send({
        message: 'No group with that identifier has been found'
      });
    }
    req.group = group;
    next();
  });
};
