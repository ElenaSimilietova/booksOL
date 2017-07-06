'use strict';

angular.module('MainModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/MainView.html',
    controller: 'MainController'
  });
}])

.controller('MainController', [function() {

}]);