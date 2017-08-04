'use strict';

angular.module('SignInModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/sign-in', {
    templateUrl: 'pages/signIn/SignInView.html',
    controller: 'SignInController'
  });
}])

.controller('SignInController', ['$scope', function($scope) {
  $scope.signIn = function() {

    var user = {
                  'email': $scope.email.value,
                  'password': $scope.password.value,
    };

    UsersFactory.signInUser(user).then(function(response) {
      // TODO: to implement after back-end implementation
      /*
      var path = '';
      if (response.status == 200) {
        path = '/success/' + encodeURIComponent(user.firstName + ' ' + user.lastName);
      } else {
        path = '/fail';
      }
      $location.path('/users/create-account' + path); */
      
    });
    
  }

  $scope.createAcconut = function() {
    $location.path('/users/create-account'); 
  }
}]);