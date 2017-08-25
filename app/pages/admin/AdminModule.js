'use strict';

angular.module('adminModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'pages/admin/admin.html',
    controller: 'AdminController'
  });
}])

.controller('AdminController', [function() {

}]);