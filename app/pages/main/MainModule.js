'use strict';

angular.module('mainModule', ['ngRoute', 'bookFactoryModule', 'popularAuthorsModule', 'genresModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/main.html',
    controller: 'MainController'
  });
}])

.controller('MainController', ['$scope', 'Book', function($scope, Book) {
  $scope.message = null;
  
  Book.getMostPopular(6).then(function(response) {
    $scope.books = [];
    var row = 0,
        col = 0;
    response.data.forEach(function(book) {

      if (col == 0) {
        $scope.books[row] = [];
        $scope.books[row].push(book);
      } else {
        $scope.books[row].push(book);
      }
      col++;
      if (col == 2) {
        col = 0;
        row++;
      }
    });
  }, function(reason) {
    $scope.message = 'Sorry, but something went wrong.';
  });
}]);

 