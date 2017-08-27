'use strict';

angular.module('signInModule', ['ngRoute', 'userFactoryModule', 'authenticationServiceModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sign-in', {
    templateUrl: 'pages/signIn/signIn.html',
    controller: 'SignInController'
  })
  .when('/log-out', {
    template: '',
    controller: 'LogOutController'
  });
}])

.controller('SignInController', ['$scope','$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {
  $scope.message = null;

  $scope.signIn = function() {

    var user = {
                  'email': $scope.email.value,
                  'password': $scope.password.value,
    };
    
    AuthenticationService.signInUser(user).then(function(response) { 
      if(response.data.token && response.data.expiresIn) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('expiresIn', response.data.expiresIn);
        $location.path('/users/profile'); 
      }  
      else {
        $scope.message = "Something went wrong. Please, try to sign in again.";
      } 
    }, function(reason) {
      // rejection
      if (reason.status == 401) {
        $scope.message = "Wrong email or password. Please, try to sign in again.";
      } else {
        $scope.message = "Something went wrong. Please, try to sign in again.";
      }
    });
  }

  $scope.createAcconut = function() {
    $location.path('/users/create-account');
  }
}])

.controller('LogOutController', ['$scope','$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

   var token = sessionStorage.getItem('token');
   var expiresIn = sessionStorage.getItem('expiresIn');
  
  AuthenticationService.logOutUser().then(function(response) {

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('period');   
    $location.path('/main');
  }, function(reason) {
    // rejection
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiresIn');
    });
 }]);