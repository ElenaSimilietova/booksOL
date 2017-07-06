'use strict';

angular.module('SignInModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/sign-in', {
    templateUrl: 'pages/signIn/SignInView.html',
    controller: 'SignInController'
  });
}])

.controller('SignInController', [function() {

}]);