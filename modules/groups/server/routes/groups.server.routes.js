'use strict';

/**
 * Module dependencies.
 */
var groupsPolicy = require('../policies/groups.server.policy'),
  groups = require('../controllers/groups.server.controller');

module.exports = function (app) {
  // groups collection routes
  app.route('/api/groups').all(groupsPolicy.isAllowed)
    .get(groups.list)
    .post(groups.create);

  app.route('/api/groups/user/userId').all(groupsPolicy.isAllowed)
    .get(groups.listByUser);

  // Single group routes
  app.route('/api/groups/:groupId').all(groupsPolicy.isAllowed)
    .get(groups.read)
    .put(groups.update)
    .delete(groups.delete);

  // Finish by binding the group middleware
  app.param('groupId', groups.groupByID);
};
