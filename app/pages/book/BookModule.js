'use strict';

angular.module('BookModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book', {
    templateUrl: 'pages/book/BookView.html',
    controller: 'BookController'
  })
  .when('/book/read', {
    templateUrl: 'pages/book/ReadView.html',
    controller: 'ReadController'
  });
}])

.controller('BookController', [function() {

}])
.controller('ReadController', [function() {

}]);
