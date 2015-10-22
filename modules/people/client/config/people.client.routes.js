'use strict';

// Setting up route
angular.module('people').config(['$stateProvider',
  function ($stateProvider) {
    // groups state routing
    $stateProvider
      .state('people', {
        abstract: true,
        url: '/people',
        template: '<ui-view/>'
      })
      .state('people.list', {
        url: '',
        templateUrl: 'modules/people/client/views/list-people.client.view.html'
      })
      .state('people.create', {
        url: '/create',
        templateUrl: 'modules/people/client/views/create-person.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      // .state('people.view', {
      //   url: '/:personId',
      //   templateUrl: 'modules/people/client/views/view-group.client.view.html'
      // })
      .state('people.edit', {
        url: '/:personId/edit',
        templateUrl: 'modules/people/client/views/edit-person.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
