'use strict';

angular.module('profileModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/profile.html',
    controller: 'ProfileController'
  });
}])

.controller('ProfileController', [function() {

}]);