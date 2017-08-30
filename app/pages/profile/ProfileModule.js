'use strict';

angular.module('profileModule', ['ngRoute', 'userFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/profile.html',
    controller: 'ProfileController'
  });
}])

.controller('ProfileController', ['$scope','$location', 'User', function($scope, $location, User) {
  var token = sessionStorage.getItem('token');

  if (token == null) {
    $location.path('/sign-in');
  };

  User.getDueDate().then(function(response) {

        $scope.firstName =  response.data.first_name;        

       if (response.data.subscription  == false) {
          $scope.subscriptionInfo = "To use Books OL service, please, subscribe again. You can pay for monthly or annual subscription below:"
          angular.element(document.getElementById('payMonthButton'))[0].disabled = false;
          angular.element(document.getElementById('payYearButton'))[0].disabled = false;
          sessionStorage.setItem('dueDateOk', 1);
       }
       else
       {
          $scope.timestamp = response.data.due_date;
          $scope.subscriptionInfo = "Your subscription is valid untill ";
          angular.element(document.getElementById('payMonthButton'))[0].disabled = true;
          angular.element(document.getElementById('payYearButton'))[0].disabled = true;
          sessionStorage.setItem('dueDateOk', 0);
       }

       }, function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else 
      if (reason.status == 401) {
        $location.path('/sign-in');
      }    
       
    });

  $scope.submitPayment = function(value) {

  var subscribeDueDate = {
                  'value': value,
  };   
	 
  User.subscribe(token, subscribeDueDate).then(function(response) {
  
      User.getDueDate().then(function(response) {        

      if (response.data.subscription  != false) {
        angular.element(document.getElementById('payMonthButton'))[0].disabled = true;
        angular.element(document.getElementById('payYearButton'))[0].disabled = true;
        $scope.subscriptionInfo = "Thanks for your subscription!";
        $location.path('/users/profile');
        sessionStorage.setItem('dueDateOk', 0);
        }
      });
      }
      , function(reason) {
      // rejection
      if (reason.status == 500) {
        $scope.message = 'Sorry, but something went wrong.';
      } else if (reason.status == 401) {
        $location.path('/sign-in');
      }
  	});
  } 
  
}]);

