'use strict';

//Groups service used for communicating with the groups REST endpoints
angular.module('groups')
	.factory('Groups', ['$resource',
	  function ($resource) {
	    return $resource('api/groups/:groupId', {
	      groupId: '@_id'
	    }, 
	    {
	      update: {
	        method: 'PUT'
	      }
	    });
	  }
	])
/*	.factory('GroupsQ', ['$resource',
	 function($resource) {
	  return {
	    All: $resource('api/groups/:groupId', {}, { 

            query: { method: 'GET', isArray: true, params:{ groupId:'@_id' } }

        }),
	    ByUser: $resource('api/groups/user/:userId', {}, { 

            query: { method: 'GET', isArray: true, params:{ userId:'@_id' } }

        })
	  }
	])*/
	.factory('NotifyGroup', ['$rootScope', function($rootScope) {

			var notifyGroup = {};

			notifyGroup.sendMsg = function(msg, data){
				data = data || {};
				$rootScope.$emit(msg, data);

				console.log('message Group sent!' + msg);
			};

			notifyGroup.getMsg = function(msg, func, scope){

				var unbind = $rootScope.$on(msg, func);
				console.log('message Group received!' + msg);
				if (scope){
					scope.$on('destroy', unbind);
				}
			};

			return notifyGroup;

		}
	]);
