'use strict';

angular.module('MainModule', ['ngRoute', 'BookFactoryModule', 'PopularAuthorsModule', 'GenresModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/MainView.html',
    controller: 'MainController'
  });
}])

.controller('MainController', ['$scope', 'Book', function($scope, Book) {
  Book.getMostPopular(6).then(function(response) {
    $scope.books = response.data;
  });
}]);

 