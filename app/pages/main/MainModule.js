'use strict';

angular.module('mainModule', ['ngRoute', 'bookFactoryModule', 'popularAuthorsModule', 'genresModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/main.html',
    controller: 'MainController'
  });
}])

.controller('MainController', ['$scope', 'Book', function($scope, Book) {
  Book.getMostPopular(6).then(function(response) {
    $scope.books = response.data;
  });
}]);

 