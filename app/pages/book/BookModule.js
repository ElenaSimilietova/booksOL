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
  .when('/books/:genre/:id', {
    templateUrl: 'pages/book/BookByGenreView.html',
    controller: 'BookByGenreController'
  })
  .when('/book/author/:id', {
    templateUrl: 'pages/book/BookByAuthorView.html',
    controller: 'BookByAuthorController'
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
  var genreId =  $routeParams.id;
  $scope.genreName = $routeParams.genre;
  
  BooksFactory.getBooksByGenre(genreId).then(function(response) {
    $scope.books = response.data;
    if ($scope.books == "")
      $scope.messageNoResults = "No books in " + $scope.genreName + " genre.";
  });
}])

.controller('BookByAuthorController', ['$scope','$routeParams','BooksFactory', function($scope, $routeParams, BooksFactory) {
  var authorID =  $routeParams.id;
  
  BooksFactory.getBooksByAuthor(authorID).then(function(response) {
    $scope.author = response.data.author;
    $scope.books = response.data.books;
  });
}]);
