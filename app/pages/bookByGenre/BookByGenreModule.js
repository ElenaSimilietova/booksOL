'use strict';

angular.module('BookByGenreModule', ['ngRoute', 'BooksFactoryModule', 'PopularAuthorsModule', 'GenresModule'])

.config(['$routeProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/bookByGenre/:param1', {
    templateUrl: 'pages/bookByGenre/BookByGenreView.html',
    controller: 'BookByGenreController'
  });
}])

.controller('BookByGenreController', ['$scope', 'BooksFactory', '$location', '$routeParams', function($scope, BooksFactory, $routeParams, $location) {
  /// $location.param1 is to get genre name from url
  BooksFactory.getBooksByGenre($location.param1).then(function(response) {
    $scope.books = response.data;
    $scope.genreName = $location.param1;
    if ($scope.books == "")
        $scope.Nothing = "No books in " + $scope.genreName + " genre.";
  });
}])