'use strict';

angular.module('SignInModule', ['ngRoute', 'UsersFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/sign-in', {
    templateUrl: 'pages/signIn/SignInView.html',
    controller: 'SignInController'
  })
  .when('/users/log-out', {
    template: '',
    controller: 'LogOutController'
  });
}])

.controller('SignInController', ['$scope','$location', 'UsersFactory', function($scope, $location, UsersFactory) {
  $scope.message = null;

  $scope.signIn = function() {

    var user = {
                  'email': $scope.email.value,
                  'password': $scope.password.value,
    };
    
    UsersFactory.signInUser(user).then(function(response) { 
      if(response.data.token && response.data.expiresIn) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('expiresIn', response.data.expiresIn);
        sessionStorage.setItem('userEmail', user.email);
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

.controller('LogOutController', ['$scope','$location', 'UsersFactory', function($scope, $location, UsersFactory) {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiresIn');
  sessionStorage.removeItem('period'); 
  sessionStorage.removeItem('userEmail'); 

  UsersFactory.logOutUser(token).then(function(response) {
    $location.path('/main');
  });
 }]);