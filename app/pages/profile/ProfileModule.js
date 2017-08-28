'use strict';

// <<<<<<< HEAD
// angular.module('ProfileModule', ['ngRoute', 'UsersFactoryModule'])
// =======
angular.module('profileModule', ['ngRoute', 'UsersFactoryModule'])
// >>>>>>> 8376985d50b43d515af5e83c729cc5887d1a3510

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/profile.html',
    controller: 'ProfileController'
  });
}])


.controller('ProfileController', ['$scope','$location', 'User', function($scope, $location, User) {
 var userEmail = sessionStorage.getItem('userEmail');
 
 User.getPayment(userEmail).then(function(response) {

       if (response.data.subscription  == 1) {
          $scope.subscriptionInfo = "Your subscription is over. To use Books OL service, please, subscribe again. You can pay for monthly or annual subscription below:"
          $scope.first = false;
          sessionStorage.setItem('period', 1);
       }
       else
       {
          $scope.subscriptionInfo = "Your subscription is valid." 
          $scope.first = true;
          sessionStorage.setItem('period', 0);
       }

       $scope.firstName =  response.data.first_name;
    });
 
  $scope.submitPayment = function(value) {
    $scope.subscriptionInfo = "Your subscription is valid." 
    sessionStorage.setItem('period', 0);
    $scope.first = true;     
    var period = {
                  'value': value,
  };

  var token = sessionStorage.getItem('token');
  if (token == null) {
    $location.path('/users/sign-in');
  };
	 
 	 User.paymentPeriod(token, period).then(function(response) {
   		$location.path('/users/profile');
  	});
  } 
  
}]);

