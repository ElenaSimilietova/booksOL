'use strict';

angular.module('ProfileModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'pages/profile/ProfileView.html',
    controller: 'ProfileController'
  });
}])

.controller('ProfileController', [function() {

}]);