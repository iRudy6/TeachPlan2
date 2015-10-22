'use strict';

// Setting up route
angular.module('lessons').config(['$stateProvider',
  function ($stateProvider) {
    // lessons state routing
    $stateProvider
      .state('lessons', {
        abstract: true,
        url: '/lessons',
        template: '<ui-view/>'
      })
      .state('lessons.list', {
        url: '',
        templateUrl: 'modules/lessons/client/views/list-lessons.client.view.html',
        data: {
          roles: ['editor', 'admin']
        }
      })
      .state('lessons.create', {
        url: '/create',
        templateUrl: 'modules/lessons/client/views/create-lesson.client.view.html',
        data: {
          roles: ['editor', 'admin']
        }
      })
      .state('lessons.view', {
        url: '/:lessonId',
        templateUrl: 'modules/lessons/client/views/view-lesson.client.view.html'
      })
      .state('lessons.edit', {
        url: '/:lessonId/edit',
        templateUrl: 'modules/lessons/client/views/edit-lesson.client.view.html',
        data: {
          roles: ['editor', 'admin']
        }
      });
  }
]);
