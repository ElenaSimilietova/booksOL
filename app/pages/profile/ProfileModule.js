'use strict';

angular.module('ProfileModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/ProfileView.html',
    controller: 'ProfileController'
  });
}])

.controller('ProfileController', [function() {

}]);