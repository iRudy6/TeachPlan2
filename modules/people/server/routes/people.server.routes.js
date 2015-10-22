'use strict';

/**
 * Module dependencies.
 */
var peoplePolicy = require('../policies/people.server.policy'),
  people = require('../controllers/people.server.controller');

module.exports = function (app) {
  // groups collection routes
  app.route('/api/people').all(peoplePolicy.isAllowed)
    .get(people.list)
    .post(people.create);

  // Single people routes
  app.route('/api/people/:personId').all(peoplePolicy.isAllowed)
    .get(people.read)
    .put(people.update)
    .delete(people.delete);

  app.route('/api/people/group/:id')
    .get(people.findByGroupID);

  // Finish by binding the group middleware
  app.param('personId', people.personByID);

  app.param('id', people.findByGroupID);

};
