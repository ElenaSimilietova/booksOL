'use strict';


angular.module('profileModule', ['ngRoute', 'userFactoryModule'])

//angular.module('profileModule', ['ngRoute'])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/profile.html',
    controller: 'ProfileController'
  });
}])


.controller('ProfileController', ['$scope','$location', 'User', function($scope, $location, User) {
 var token = sessionStorage.getItem('token');
 
 User.getDueDate(token).then(function(response) {
         
       if (response.data.subscription  == 1) {
          $scope.subscriptionInfo = "Your subscription is over. To use Books OL service, please, subscribe again. You can pay for monthly or annual subscription below:"
          $scope.disableButton = false;
          sessionStorage.setItem('period', 1);
       }
       else
       {
          $scope.subscriptionInfo = "Your subscription is valid." 
          $scope.disableButton = true;
          sessionStorage.setItem('period', 0);
       }
       $scope.firstName =  response.data.first_name;

       }, function(reason) {
      // rejection
      if (reason.status == 401) {
        $location.path('/users/sign-in');
      }    
       
    });
 
  $scope.submitPayment = function(value) {
    $scope.subscriptionInfo = "Your subscription is valid." 
    sessionStorage.setItem('period', 0);
    $scope.disableButton = true;   
   
    var subscribePeriod = {
                  'value': value,
  };

  var token = sessionStorage.getItem('token');
  if (token == null) {
    $location.path('/users/sign-in');
  };
	 
 	 User.subscribe(token, subscribePeriod).then(function(response) {
   		$location.path('/users/profile');
  	});
  } 
  
}]);

