'use strict';

var peopleApp = angular.module('people');

// People controller
// angular.module('people').controller('PeopleController', ['$scope', '$stateParams', '$location', 'Authentication', 'People','$modal', '$log',
//  function($scope, $stateParams, $location, Authentication, People) {
peopleApp.controller('PeopleController', ['$scope', '$stateParams', '$location', 'Authentication', 'People', '$modal', '$log',
  function($scope, $stateParams, $location, Authentication, People, $modal, $log) {

    this.authentication = Authentication;

    
    this.people = People.query();
    
    //Open a modal to Update 
    this.modalUpdate = function (size, selectedPerson) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/people/client/views/edit-person.client.view.html',
          controller: function ($scope, $modalInstance, person){
            $scope.person = selectedPerson;

              $scope.ok = function () {

                if(this.updatePersonForm.$valid){
                  $modalInstance.close($scope.person);
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            person: function () {
              $log.info(selectedPerson.firstname);
              return selectedPerson;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
          $log.info(selectedPerson.lastname);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
      //end

    //Open a modal to create 
    this.modalCreate = function (size) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/people/client/views/create-person.client.view.html',
          controller: function ($scope, $modalInstance){

              $scope.ok = function () {
                if(this.createPersonForm.$valid){
                  $modalInstance.close();
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
      //end



  }
]);

peopleApp.controller('PeopleCreateController', ['$scope', 'People', 'Notify','$stateParams', '$log',
  function($scope, People, Notify, $stateParams, $log) {

    $scope.genres = [
      {name: 'garçon'},
      {name: 'fille'},
    ];
    // Create new Person
    this.create = function() {
      // Create new Person object
      var person = new People ({
        firstname: this.firstname,
        lastname: this.lastname, 
        email: this.email,
        phone: this.phone,
        genre: this.genre,
        contact1_firstname: this.contact1_firstname,
        contact1_lastname: this.contact1_lastname,
        contact1_phone: this.contact1_phone,
        contact2_firstname: this.contact2_firstname,
        contact2_lastname: this.contact2_lastname,
        contact2_phone: this.contact2_phone,
        groups: []
      });

    if ($stateParams.groupId)
    {
      $log.info($stateParams.groupId);
      var groupId = $stateParams.groupId;
      //$log.info('PeopleByGroupController.addGroup: '+ groupId);
      if (person.groups.contains(groupId))
      {
        $log.info('already contain this group');        
      }
      else
      {
        person.groups.push(groupId);
      }
    }

      // Redirect after save
      person.$save(function(response) {
        // Clear form fields
        $scope.firstname = '';
        $scope.lastname = '';
        $scope.email = '';
        $scope.phone = '';
        $scope.genre = '';
        $scope.contact1_firstname = '';
        $scope.contact1_lastname = '';
        $scope.contact1_phone = '';
        $scope.contact2_firstname = '';
        $scope.contact2_lastname = '';
        $scope.contact2_phone = '';

        //Notify service
        Notify.sendMsg('NewPerson', {'id' : response._id});
        if($stateParams.groupId)
          Notify.sendMsg('AddPeopleToGroup', {'id' : person._id});
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


  }
]);

peopleApp.controller('PeopleEditController', ['$scope', 'People', 'Notify','$log',
  function($scope, People, Notify,$log) {

    $scope.genres = [
      {name: 'garçon'},
      {name: 'fille'},
    ];
    // Update existing Person
    this.update = function(updatedPerson) {
/*      var person = new People();
      person.firstname = updatedPerson.firstname;
      person.lastname = updatedPerson.lastname;
      person.phone = updatedPerson.phone; 
      person.email = updatedPerson.email;
      person.genre = updatedPerson.genre;
      person.contacts = [];
*/     
      //$log.info(updatedPerson.contacts);
      
      //person.contacts.push(updatedPerson.contacts[0]);
/*      person.contacts.push({
        firstname: updatedPerson.contacts[0].firstname,
        lastname: updatedPerson.contacts[0].lastname,
        phone: updatedPerson.contacts[0].phone,
      });
*//*      person.contacts.push({
        firstname: updatedPerson.contacts[1].firstname,
        lastname: updatedPerson.contacts[1].lastname,
        phone: updatedPerson.contacts[1].phone,
      });
*/    
/*        var person = new People ({
        firstname: updatedPerson.firstname,
        lastname: updatedPerson.lastname, 
        email: updatedPerson.email,
        phone: updatedPerson.phone,
        genre: updatedPerson.genre,
        contact1_firstname: updatedPerson.contact1_firstname,
        contact1_lastname: updatedPerson.contact1_lastname,
        contact1_phone: updatedPerson.contact1_phone,
        contact2_firstname: updatedPerson.contact2_firstname,
        contact2_lastname: updatedPerson.contact2_lastname,
        contact2_phone: updatedPerson.contact2_phone,
        group: []
      });
*/
      //var person = updatedPerson;  
      //alert(person.contact1_firstname);
      updatedPerson.$update(function() {
        // $location.path('people/' + person._id);
                //Notify service
        Notify.sendMsg('UpdatePerson');

      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Person
    this.remove = function(person) {
      if ( person ) { 
        person.$remove();
        for (var i in this.people) {
          if (this.people [i] === person) {
            this.people.splice(i, 1);
          }
        }
      } 
      else {
        this.person.$remove(function() {
          // $location.path('people');
          console.log('removed');
          
        });
      }
      //Notify service
      Notify.sendMsg('DeletePerson', {'id' : person._id});
    };

  }
]);

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};


peopleApp.controller('PeopleByGroupController', ['$scope', 'People', 'Groups', 'Notify','$log', '$stateParams', '$modal',
  function($scope, People, Groups, Notify, $log, $stateParams, $modal) {

  
  // this.people = People.query();
  this.people = People.query();
    // this.currentGroup = ['55c1fc29802c437411cdedbc'];

    //Open a modal to Update 
    this.modalShow = function (size,selectedPerson) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/people/client/views/view-person.client.view.html',
          controller: function ($scope, $modalInstance, person){
            $scope.person = selectedPerson;

              $scope.ok = function () {                
                $modalInstance.close($scope.person);
                
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            person: function () {
              $log.info(selectedPerson.firstname);
              return selectedPerson;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
          $log.info(selectedPerson.lastname);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
    };
      //end

  //Add a group to the person
  this.addGroup = function(person,group){
    console.log('add a group '+ group._id+ ' to '+person.firstname);
    var groupId = group._id;
    $log.info('PeopleByGroupController.addGroup: '+ groupId);
    if (person.groups.contains(groupId))
    {
      $log.info('already contain this group');        
    }
    else
    {
      person.groups.push(groupId);
      
      $scope.person = person;
      person.$update(function() {
        console.log('updated');
        //Notify service
        Notify.sendMsg('AddPeopleToGroup', {'id' : person._id});
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  };

  //remove a group to the person
  this.removeGroup = function(person,group){
    console.log('remove a group '+ group.id+ ' to '+person.firstname);
    var groupId = group._id;
    $log.info('PeopleByGroupController.addGroup: '+ groupId);
    if (person.groups.contains(groupId))
    {
      person.groups.splice(person.groups.indexOf(groupId),1);
      $scope.person = person;
      person.$update(function() {
        console.log('updated');
        //Notify service
        Notify.sendMsg('AddPeopleToGroup', {'id' : person._id});
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      
    }
    else
    {
      $log.info('no group inside');       
      
    }
  };

}]);

/*peopleApp.controller('PeopleByLessonController', ['$scope', 'People',
  function($scope, People) {

  $scope.personDetails = function(studentId)
    {
      $scope.status = status;
      $scope.studentId = studentId;
      this.person = People.get({personId:$scope.studentId});
    };

}]);
*/


//FIlter
peopleApp.filter('filterByGroupId', function() {
    return function(people, currentGroup) {
        return people.filter(function(person) {
      //console.log('-------------------person: ' + person.firstname + ' | Current group: '+ currentGroup);
            for (var i in person.groups) {
                if (currentGroup.indexOf(person.groups[i]) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
});

peopleApp.filter('filterNotInGroupId', function() {
    return function(people, currentGroup) {
        return people.filter(function(person) {
          console.log('filterNotInGroupId ' + currentGroup);
      //console.log('person: ' + person.firstname + ' | groupId: '+ person.groups);
            for (var i in person.groups) {
                if (currentGroup.indexOf(person.groups[i]) !== -1) {
                    return false;
                }
            }
            return true;

        });
    };
});

//Directive

//People by lesson, on click to view a lesson
peopleApp.directive('peopleLesson', ['Notify', function(Notify){
  return {
    restrict: 'E',
    transclude: true,
    //controller: 'PeopleByLessonController'
    templateUrl:'modules/people/client/views/people-lesson-template.html',
    link: function(scope, element, attrs){
      //When the person status is updated
       Notify.getMsg('UpdatePersonStatus', function(event, data){
        console.log('notify receive UpdatePersonStatus');
        console.log(data.person);
        scope.peopleByLessonCtrl.students = data;

       });
    }
  };
}]);

peopleApp.directive('peopleList', ['People', 'Notify', function(People, Notify){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl:'modules/people/client/views/people-list-template.html',
    link: function(scope, element, attrs){
      scope.$watch("status",function(newValue,oldValue) {
        console.log('watch');
      });
      //When new person is added, update
      Notify.getMsg('NewPerson', function(event, data){
        scope.peopleCtrl.people = People.query();       
      });
      Notify.getMsg('UpdatePerson', function(event, data){
        scope.peopleCtrl.people = People.query();       
      });
      Notify.getMsg('DeletePerson', function(event, data){
        console.log('notify receive deleteperson');
        scope.peopleCtrl.people = People.query();       
      });
    }
  };
}]);

peopleApp.directive('peopleSorted', ['People', 'Notify', function(People, Notify){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl:'modules/people/client/views/people-sorted-template.html',
    link: function(scope, element, attrs){
      //When new person is added, update
      Notify.getMsg('AddPeopleToGroup', function(event, data){
        console.log('notify receive AddPeopleToGroup');
        scope.peopleByGroupCtrl.people = People.query();        
      });
    }
  };
}]);
    
peopleApp.directive('peopleAdd', ['People', 'Notify', function(People, Notify){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl:'modules/people/client/views/people-add-template.html',
    link: function(scope, element, attrs){
      //When new person is added, update
      Notify.getMsg('AddPeopleToGroup', function(event, data){
        console.log('notify receive AddPeopleToGroup');
        scope.peopleByGroupCtrl.people = People.query();        
      });
    }
  };
}]);


    // $scope.currentPage = 1;
    // $scope.pageSize = 2;
    // $scope.offset = 0;

    

    // //page changed handler
    // $scope.pageChanged = function(){
    //  $scope.offset = ($scope.currentPage -1) * $scope.pageSize;
    // };

    // //search
    // $scope.peopleSearch = function(personItem){
    //  console.log('peopleSearch: '+personItem.firstname);
    //  // $location.path('')
    // };

    // // Create new Person
    // $scope.create = function() {
    //  // Create new Person object
    //  var person = new People ({
    //    firstname: this.firstname,
    //    lastname: this.lastname, 
    //    email: this.email,
    //    phone: this.phone,
    //    group: []
    //  });

    //  // Redirect after save
    //  person.$save(function(response) {
    //    $location.path('people/' + response._id);

    //    // Clear form fields
    //    $scope.firstname = '';
    //    $scope.lastname = '';
    //    $scope.email = '';
    //    $scope.phone = '';
        
    //  }, function(errorResponse) {
    //    $scope.error = errorResponse.data.message;
    //  });
    // };


    // // Find Person from group
    // $scope.findByGroupId = function(groupId) {
    //  console.log('findByGroupId client');
    //  $scope.people = People.query({groups:groupId});
    //  // $scope.person = People.query({ 
    //  //  group: groupId
    //  // }, function(people){
    //  //  $scope.people = people;
    //  // });
    // };




    // // Find existing Person
    // $scope.findOne = function() {
    //  $log.info('inside findOne');
    //  $scope.person = People.get({ 
    //    personId: $stateParams.personId
    //  });
    // };










// 'use strict';

// var peopleApp = angular.module('people');

// // groups controller
// peopleApp.controller('GroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Groups', '$modal', '$log',
//   function ($scope, $stateParams, $location, Authentication, Groups, $modal, $log) {
//     $scope.authentication = Authentication;

//     this.groups = Groups.query();
//     // Find a list of groups
//     this.init = function () {
//       this.group = Groups.get({ 
//         groupId: $stateParams.groupId
//       });

//     };


//     //Open a modal to create a group
//     this.modalCreateGroup = function (size) {

//         var modalInstance = $modal.open({
//           animation: $scope.animationsEnabled,
//           templateUrl: 'modules/groups/client/views/create-group.client.view.html',
//           controller: function ($scope, $modalInstance){

//               $scope.ok = function () {
//                 if(this.createGroupForm.$valid){
//                   $modalInstance.close();
//                 }
//           };

//           $scope.cancel = function () {
//             $modalInstance.dismiss('cancel');
//           };

//           },
//           size: size
//         });

//         modalInstance.result.then(function (selectedItem) {
//         }, function () {
//           $log.info('Modal group dismissed at: ' + new Date());
//         });
//     };
//       //end

//     //Open a modal to Update 
//     this.modalUpdate = function (size, selectedGroup) {

//         var modalInstance = $modal.open({
//           animation: $scope.animationsEnabled,
//           templateUrl: 'modules/groups/client/views/edit-group.client.view.html',
//           controller: function ($scope, $modalInstance, group){
//             $scope.group = selectedGroup;

//               $scope.ok = function () {

//                 if(this.updateGroupForm.$valid){
//                   $modalInstance.close($scope.group);
//                 }
//           };

//           $scope.cancel = function () {
//             $modalInstance.dismiss('cancel');
//           };

//           },
//           size: size,
//           resolve: {
//             group: function () {
//               $log.info(selectedGroup);
//               return selectedGroup;
//             }
//           }
//         });

//         modalInstance.result.then(function (selectedItem) {
//           $scope.selected = selectedItem;
//           $log.info(selectedGroup.name);
//         }, function () {
//           $log.info('Modal dismissed at: ' + new Date());
//         });
//     };
//       //end


//     // Create new group
//     // $scope.create = function (isValid) {
//     //   $scope.error = null;

//     //   if (!isValid) {
//     //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

//     //     return false;
//     //   }

//     //   // Create new group object
//     //   var group = new Groups({
//     //     name: this.name,
//     //     category: this.category
//     //   });

//     //   // Redirect after save
//     //   group.$save(function (response) {
//     //     $location.path('groups/' + response._id);

//     //     // Clear form fields
//     //     $scope.name = '';
//     //     //$scope.category = '';
//     //   }, function (errorResponse) {
//     //     $scope.error = errorResponse.data.message;
//     //   });
//     // };

//     // // Remove existing group
//     // $scope.remove = function (group) {
//     //   if (group) {
//     //     group.$remove();

//     //     for (var i in $scope.groups) {
//     //       if ($scope.groups[i] === group) {
//     //         $scope.groups.splice(i, 1);
//     //       }
//     //     }
//     //   } else {
//     //     $scope.group.$remove(function () {
//     //       $location.path('groups');
//     //     });
//     //   }
//     // };

//     // // Update existing group
//     // $scope.update = function (isValid) {
//     //   $scope.error = null;

//     //   if (!isValid) {
//     //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

//     //     return false;
//     //   }

//     //   var group = $scope.group;

//     //   group.$update(function () {
//     //     $location.path('groups/' + group._id);
//     //   }, function (errorResponse) {
//     //     $scope.error = errorResponse.data.message;
//     //   });
//     // };

//     // // Find a list of groups
//     // $scope.find = function () {
//     //   $scope.groups = Groups.query();
//     // };

//     // Find existing group
//     $scope.findOne = function () {
//       $scope.group = Groups.get({
//         groupId: $stateParams.groupId
//       });
//     };
//   }
// ]);


// groupApp.controller('GroupsCreateController', ['$scope', 'Groups', 'NotifyGroup',
//   function($scope, Groups, NotifyGroup) {

//     this.create = function (isValid) {
//       this.error = null;

//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'createGroupForm');

//         return false;
//       }

//       // Create new group object
//       var group = new Groups({
//         name: this.name,
//         category: this.category
//       });

//       // Redirect after save
//       group.$save(function (response) {

//         // Clear form fields
//         $scope.name = '';
//         //$scope.category = '';
//         NotifyGroup.sendMsg('NewGroup', {'id' : response._id});        
//       }, function (errorResponse) {
//         $scope.error = errorResponse.data.message;
//       });
//     };

// }]);


// groupApp.controller('GroupsEditController', ['$scope', 'Groups', 'NotifyGroup', '$location',
//   function($scope, Groups, NotifyGroup, $location) {

//     // Update existing Group
//     this.update = function(updatedGroup) {
//       var group = updatedGroup;
//       console.log(updatedGroup.name);
//       group.$update(function() {
        
//       }, function(errorResponse) {
//         $scope.error = errorResponse.data.message;
//       });
//     };

//     // this.update = function (isValid, updatedGroup) {
//     //   $scope.error = null;

//     //   if (!isValid) {
//     //     $scope.$broadcast('show-errors-check-validity', 'groupForm');

//     //     return false;
//     //   }

//     //   var group = $scope.group;

//     //   group.$update(function () {
//     //     $location.path('groups/' + group._id);
//     //   }, function (errorResponse) {
//     //     $scope.error = errorResponse.data.message;
//     //   });
//     // };


//     // Remove existing Group
//     this.remove = function(group) {
//       if ( group ) { 
//         group.$remove();

//         for (var i in $scope.groups) {
//           if ($scope.groups [i] === group) {
//             $scope.groups.splice(i, 1);
//           }
//         }
//       } else {
//         $scope.group.$remove(function() {
        
//         });
//       }
//       $location.path('groups');
//       //Notify service
//       //NotifyGroup.sendMsg('DeleteGroup', {'id' : group._id});
//     };



// }]);






// //Directive

// groupApp.directive('groupsList', ['Groups', 'NotifyGroup', '$log', function(Groups, NotifyGroup, $log){
//   return {
//     restrict: 'E',
//     transclude: true,
//     templateUrl:'modules/groups/client/views/groups-list-template.html',
//     link: function(scope, element, attrs){
//       //When new group is added, update
//       NotifyGroup.getMsg('NewGroup', function(event, data){
//         $log.info('notifyGroup receive NewGroup');
//         scope.groupsCtrl.groups = Groups.query();
//       });
//       //When new person is added, update
//       NotifyGroup.getMsg('AddPeopleToGroup', function(event, data){
//         scope.groupsCtrl.groups = Groups.query();
//         $log.info('notifyGroup receive AddPeopleToGroup');
//       });
//       //When Group, update
//       NotifyGroup.getMsg('DeleteGroup', function(event, data){
//         scope.groupsCtrl.groups = Groups.query();
//         $log.info('notifyGroup receive DeleteGroup');
//       });
//     }
//   };
// }]);

