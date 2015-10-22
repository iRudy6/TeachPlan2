'use strict';

//Groups service used for communicating with the groups REST endpoints
angular.module('people')
	.factory('People', ['$resource',
	  function ($resource) {
	    return $resource('api/people/:personId', {
	      personId: '@_id'
	    }, {
	      update: {
	        method: 'PUT'
	      }
	    });
	  }
	])
	.factory('PeopleGroup', ['$resource',
	 function($resource) {
	  return {
	    Groups: $resource('api/people/group/:id', {}, { 

            query: { method: 'GET', isArray: true, params:{ id:'@id' } }

        })
	   //  All:  $resource('/people/:personId', {personId: '@id'},
				// {
				// 	update: {
				// 		method: 'PUT'
				// 	}
				// //pour passer le status automatiquement via people.$enable()
				// //'enable': {method: 'PUT', {userId: '@id', params; { 'enabled': true } }
				// })
	  	};
	  }
	])
	.factory('Notify', ['$rootScope', function($rootScope) {

			var notify = {};

			notify.sendMsg = function(msg, data){
				data = data || {};
				$rootScope.$emit(msg, data);

				console.log('message People sent!' + msg);
			};

			notify.getMsg = function(msg, func, scope){

				var unbind = $rootScope.$on(msg, func);
				console.log('message People received!' + msg);
				if (scope){
					scope.$on('destroy', unbind);
				}
			};

			return notify;

		}
	]);
