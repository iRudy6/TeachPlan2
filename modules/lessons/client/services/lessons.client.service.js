'use strict';

//Groups service used for communicating with the groups REST endpoints
angular.module('lessons')
	.factory('Lessons', ['$resource',
	  function ($resource) {
	    return $resource('api/lessons/:lessonId', {
	      lessonId: '@_id'
	    }, {
	      update: {
	        method: 'PUT'
	      },
	      filtered: { method:'GET', url: 'api/lessons/filter/:groupId/:from', params: { groupId: '@groupId', from: '@from' }, isArray: true }
	    });
	  }
	])
	.factory('NotifyLesson', ['$rootScope', function($rootScope) {

			var notifyLesson = {};

			notifyLesson.sendMsg = function(msg, data){
				data = data || {};
				$rootScope.$emit(msg, data);

				console.log('message Lesson sent!' + msg);
			};

			notifyLesson.getMsg = function(msg, func, scope){

				var unbind = $rootScope.$on(msg, func);
				console.log('message Lesson received!' + msg);
				if (scope){
					scope.$on('destroy', unbind);
				}
			};

			return notifyLesson;

		}
	]);
