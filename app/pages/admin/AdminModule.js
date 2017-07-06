'use strict';

angular.module('AdminModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'pages/admin/AdminView.html',
    controller: 'AdminController'
  });
}])

.controller('AdminController', [function() {

}]);