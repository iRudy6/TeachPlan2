'use strict';

var lessonApp = angular.module('lessons');

function formattedDate(date, type) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (type==="en")
      return [month, day, year].join('/');
    return [day, month, year].join('/');
}
/*Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
};
*/
lessonApp.controller('LessonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Lessons', 'Groups', 'People', 'PeopleGroup', 'NotifyLesson', '$modal', '$log', 
  function($scope, $stateParams, $location, Authentication, Lessons, Groups, People, PeopleGroup, NotifyLesson, $modal, $log) {
    this.authentication = Authentication;
    this.user = Authentication.user;
    //var now = moment();
    var now = formattedDate(Date.now(), "en");
    //$log.info(now.format('YYYY-DD-MM'));
    //$log.info(now.getDate()+'-'+(now.getMonth()+1) +'-'+ now.getYear());
    this.init=function(){
      this.lessons = Lessons.filtered({groupId: $stateParams.groupId, from: now});
    };
    
    this.currentLesson={};
    this.showGroup = true;

    this.showGroupAndClear=function(show){
      this.showGroup=true;
      this.currentLesson={};
    };

    this.lessonChanged=function(lesson){
      $log.info('lessonChanged => currentLesson: ' +lesson.name);
      
      this.currentLesson=lesson;
      this.showGroup = false;
    };

    this.selectLesson=function(lessonId){
      $log.info('lessonId: '+lessonId);
      //this.lessons=Lessons.query();

      this.currentLesson = Lessons.get({ 
        lessonId: lessonId
      });
      this.lessons.push(this.currentLesson);
      $log.info('currentLesson: ' +this.currentLesson.name);
      this.showGroup = false;
      
    };

  this.statusClass = function(status) {
    switch(status){
      case 0 : 
        return 'status-0';
      case 1 : 
        return 'status-1';
      case 2 : 
        return 'status-2';
      case 3 : 
        return 'status-3';

    }
  };
  //Status name show in the box
  this.statusName = function(status) {
    switch(status){
      case 0 : 
        return '';
      case 1 : 
        return 'Présent';
      case 2 : 
        return 'Absent';
      case 3 : 
        return 'Malade';

    }
  };

  //Update the presence
  this.updateStatus = function(currentLesson,person,status){
    $log.info('updateStatus in lessonsCtrl');
    var lesson = currentLesson;
    var newStatus=0;
    switch(status){
      case 0: 
        newStatus=1;
        break; 
      case 1: 
        newStatus=2;
        break; 
      case 2: 
        newStatus=3;
        break; 
      case 3: 
        newStatus=0;
        break; 
    }
    person.status=newStatus;
    for (var i=0; i< lesson.students.length;i++) {
      //$log.info(lesson.students[i].person._id);
      if (lesson.students[i].person._id === person._id) {
        lesson.students[i].status = newStatus;
      }
    }

    Lessons.update({id:lesson._id}, lesson);
  };

    // Remove existing Lesson
    $scope.remove = function(lesson) {
      if ( lesson ) { 
        lesson.$remove();

        for (var i in $scope.lessons) {
          if ($scope.lessons [i] === lesson) {
            $scope.lessons.splice(i, 1);
          }
        }
      } else {
        $scope.lesson.$remove(function() {
          $location.path('lessons');
        });
      }
    };
//******
//MODAL
//******
    //Open a modal to create a lesson
    this.modalCreateShortLesson = function (size, currentGroup) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/lessons/client/views/create-lesson.client.view.html',
          controller: function ($scope, $modalInstance){
            $scope.currentGroup=currentGroup;

              $scope.ok = function () {
                if(this.createLessonForm.$valid){
                  $modalInstance.close();
                }
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            currentGroup: function () {
              $log.info('currentGroupId from groupController' + currentGroup._id);
              return currentGroup;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal lesson dismissed at: ' + new Date());
        });
    };
      //end

    //Open a modal to share the students status of a lesson
    this.modalShare = function (size, currentLesson, group) {

        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'modules/lessons/client/views/share-lesson.client.view.html',
          controller: function ($scope, $modalInstance){
            $scope.currentLesson = currentLesson;
            $scope.group = group;
              $scope.ok = function () {
                $modalInstance.close();
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          },
          size: size,
          resolve: {
            currentLesson: function () {
              return currentLesson;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
        }, function () {
          $log.info('Modal lesson dismissed at: ' + new Date());
        });
    };
      //end

    this.printReport = function(){
      window.print();
    };  

    this.sendReport = function(groupId){
      // using SendGrid's Node.js Library - https://github.com/sendgrid/sendgrid-nodejs
      var sendgrid = require("sendgrid")("carlier.rudy", "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");
      var email = new sendgrid.Email();

      email.addTo("test@sendgrid.com");
      email.setFrom("carlier.rudy@gmail.com");
      email.setSubject("First mail test");
      email.setHtml("and easy to do anywhere, even with Node.js. <BR/><h1>Hello you</h1>");

      sendgrid.send(email);

    };
 
      // Create new Lesson
    this.createSpeedLesson = function(currentGroupId) {
      $scope.peopleByGroup = PeopleGroup.Groups.query({id:currentGroupId});
      $log.info('createSpeedLesson => currentGroupId: '+currentGroupId);
      var now = Date.now();
      var nowEnd = new Date();
      nowEnd.setHours(nowEnd.getHours()+1);
      // Create new Group object
      var lesson = new Lessons ({
        name: 'lesson',
        createDate: now, 
        beginDate: now, 
        endDate: nowEnd,
        students: [],
        groups: []
      });

      lesson.groups.push(currentGroupId);
      PeopleGroup.Groups.query({id:currentGroupId}, function(data){
        for (var i = 0; i < data.length; i++) {
          $log.info('createSpeedLesson => PeopleGroup Query: ' + data[i]._id);
          lesson.students.push({
            person: data[i]._id, 
            status: 0
          });
        }
        // Redirect after save
        lesson.$save(function(response) {
          NotifyLesson.sendMsg('NewSpeedLesson', {'id' : response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      });
    };



    // Update existing Lesson
    $scope.update = function() {
      var lesson = $scope.lesson;

      lesson.$update(function() {
        $location.path('lessons/' + lesson._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Lessons
    $scope.find = function() {
      $scope.lessons = Lessons.query();
    };

    // Find existing Lesson
    $scope.findOne = function() {
      $scope.lesson = Lessons.get({ 
        lessonId: $stateParams.lessonId
      });
    };
  }
]);

lessonApp.controller('DatepickerCtrl', ['$scope', 
  function($scope) {
  
  $scope.today = function() {
    var now = new Date();
    
    $scope.dt = formattedDate(now, "fr");
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };
  
  $scope.status = {
    opened: false
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

}]);


lessonApp.controller('LessonsCreateController', ['$scope', 'Lessons', 'PeopleGroup', 'NotifyLesson', '$log', '$state', 
  function($scope, Lessons, PeopleGroup, NotifyLesson, $log, $state) {

    function createStudent(person, status) {

      return {
        person: person,
        status: status
      };
    }
      // Create new Lesson
    this.createShortLesson = function(currentGroupId) {
      //$scope.peopleByGroup = PeopleGroup.Groups.query({id:currentGroupId});

      var now = Date.now();
      // Create new Group object
      var nowEnd = new Date();
      nowEnd.setHours(nowEnd.getHours()+1);

      var lesson = new Lessons ({
        name: this.name,
        createDate: now, 
        beginDate: now, 
        endDate: nowEnd,
        students: [],
        groups: []
      });

      lesson.groups.push(currentGroupId);
      PeopleGroup.Groups.query({id:currentGroupId}, function(data){
        $log.info('PeopleGroup.Groups.query with currentGroupId: ' + currentGroupId);
        for (var i = 0; i < data.length; i++) {
          $log.info('createSpeedLesson => PeopleGroup Query: ' + data[i]._id);

          lesson.students.push({
            person: data[i]._id, 
            status: 0
          });
        }
        lesson.$save(function(response) {
          $scope.name = ''; 
          NotifyLesson.sendMsg('NewLesson', {'id' : response._id});
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      });
    
    };

}]);


//Now filter is in query
/*lessonApp.filter('filterByGroupId', function() {
    return function(lessons, currentGroup) {
        return lessons.filter(function(lesson) {
      //console.log('person: ' + person.firstname + ' | groupId: '+ person.groups);
            for (var i in lessons.groups) {
                if (currentGroup.indexOf(lesson.groups[i]) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
});*/

lessonApp.filter('filterByLessonId', function() {
    return function(lessons, currentLesson) {
        return lessons.filter(function(lesson) {
      //console.log('person: ' + person.firstname + ' | groupId: '+ person.groups);
            for (var i in lessons) {
                if (currentLesson.indexOf(lesson[i]) !== -1) {
                    return true;
                }
            }
            return false;

        });
    };
});


lessonApp.directive('listLessons', ['Lessons', 'NotifyLesson', function(Lessons, NotifyLesson){
  return {
    restrict: 'E',
    transclude: true,
    controller: 'LessonsController',
    templateUrl:'modules/lessons/client/views/list-lessons-template.html',
    link: function(scope, element, attrs){
      //When new person is added, update
       NotifyLesson.getMsg('NewLesson', function(event, data){
        console.log('notify receive NewLesson');
        //scope.lessonsCtrl.lessons = Lessons.query(); 
        scope.lessonsCtrl.selectLesson(data.id);       
       });
       NotifyLesson.getMsg('NewSpeedLesson', function(event, data){
        console.log('notify receive NewSpeedLesson: '+data.id);
        //scope.lessonsCtrl.lessons = Lessons.query();        
        scope.lessonsCtrl.selectLesson(data.id);
        

       });
    }
  };
}]);
