'use strict';

angular.module('BookModule', ['ngRoute', 'BooksFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/book/:id', {
    templateUrl: 'pages/book/BookView.html',
    controller: 'BookController'
  })
  .when('/book/read/:id', {
    templateUrl: 'pages/book/ReadView.html',
    controller: 'ReadController'
  });
}])

.controller('BookController', ['$scope','$routeParams', 'BooksFactory', function($scope, $routeParams, BooksFactory) {
  var bookId = $routeParams.id;
  $scope.book = BooksFactory.getBook(bookId);

}])
.controller('ReadController', ['$scope','$routeParams', 'BooksFactory', function($scope, $routeParams, BooksFactory) {
  var bookId = $routeParams.id;

  $scope.book = BooksFactory.getInfo(bookId);
  $scope.content = BooksFactory.getContent(bookId, 1);
  $scope.newPage = 1;

  $scope.showPage = function() {

    if ($scope.newPage < 1) {
      $scope.newPage = 1;
    } else if ($scope.newPage > $scope.book.pages_num){
       $scope.newPage = $scope.book.pages_num;
    }
  
    $scope.content = BooksFactory.getContent(bookId, $scope.newPage);
    $scope.page = $scope.newPage;
  }

}]);
