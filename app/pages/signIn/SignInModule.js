'use strict';

angular.module('signInModule', ['ngRoute', 'userFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/sign-in', {
    templateUrl: 'pages/signIn/signIn.html',
    controller: 'SignInController'
  })
  .when('/users/log-out', {
    template: '',
    controller: 'LogOutController'
  });
}])

.controller('SignInController', ['$scope','$location', 'User', function($scope, $location, User) {
  $scope.message = null;

  $scope.signIn = function() {

    var user = {
                  'email': $scope.email.value,
                  'password': $scope.password.value,
    };
    
    User.signInUser(user).then(function(response) { 
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

.controller('LogOutController', ['$scope','$location', 'User', function($scope, $location, User) {

  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('expiresIn');
  sessionStorage.removeItem('period');   


  User.logOutUser().then(function(response) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiresIn');
    $location.path('/main');
  });
 }]);