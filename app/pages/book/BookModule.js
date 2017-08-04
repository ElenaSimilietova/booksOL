'use strict';

angular.module('BookModule', ['ngRoute', 'BooksFactoryModule', 'PageContentModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book/:id', {
    templateUrl: 'pages/book/BookView.html',
    controller: 'BookController'
  })
  .when('/book/read/:id', {
    templateUrl: 'pages/book/ReadView.html',
    controller: 'ReadController'
  })
  .when('/books/:genre', {
    templateUrl: 'pages/book/BookByGenreView.html',
    controller: 'BookByGenreController'
  });
}])

.controller('BookController', ['$scope','$routeParams', 'BooksFactory', function($scope, $routeParams, BooksFactory) {
  var bookId = $routeParams.id;
  BooksFactory.getBook(bookId).then(function(response) {
    $scope.book = response.data;
  });

}])
.controller('ReadController', ['$scope','$routeParams', 'BooksFactory', function($scope, $routeParams, BooksFactory) {
  var bookId = $routeParams.id;

  $scope.bookId = bookId;
  BooksFactory.getInfo(bookId).then(function(response){
    $scope.bookName = response.data.name;
    $scope.bookPagesNumber = response.data.pages_number;
  });

  BooksFactory.getPageContent(bookId, 1).then(function(response) {
     $scope.content = decodeURIComponent(response.data.content);
  });
  
  $scope.page = 1;
  $scope.newPage = 1;

  $scope.showPage = function() {

    if ($scope.newPage < 1) {
      $scope.newPage = 1;
    } else if ($scope.newPage > $scope.bookPagesNumber){
       $scope.newPage = $scope.bookPagesNumber;
    }
  
    BooksFactory.getPageContent(bookId, $scope.newPage).then(function(response) {
      $scope.content = decodeURIComponent(response.data.content);
    });

    $scope.page = $scope.newPage;
  }


}])

.controller('BookByGenreController', ['$scope','$routeParams','BooksFactory', function($scope, $routeParams, BooksFactory) {
  var genre =  $routeParams.genre;
  $scope.genreName = genre;
  
  BooksFactory.getBooksByGenre(genre).then(function(response) {
    $scope.books = response.data;
    if ($scope.books == "")
      $scope.messageNoResults = "No books in " + $scope.genreName + " genre.";
  });
}]);
