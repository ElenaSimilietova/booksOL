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

        var tokenArr = response.data.token.split('.');
        var payload = JSON.parse(atob(tokenArr[1]));
        
        switch(payload.role) {
          case 'administrator':
            $location.path('/dashboard'); 
            break;
          case 'reader':
            $location.path('/users/profile'); 
            break;
          default: 
            $location.path('/users/profile'); 
            break;
        }
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
  AuthenticationService.logOutUser().then(function(response) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('dueDateOk'); 

    $location.path('/main');
  }, function(reason) {
    // rejection
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('dueDateOk'); 
    });
 }]);