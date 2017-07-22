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

  $scope.book = BooksFactory.getInfo(bookId);

  BooksFactory.getPageContent(bookId, 1).then(function(response) {
     $scope.content = decodeURIComponent(response.data.content);
  });
  
  $scope.page = 1;
  $scope.newPage = 1;

  $scope.showPage = function() {

    if ($scope.newPage < 1) {
      $scope.newPage = 1;
    } else if ($scope.newPage > $scope.book.pages_num){
       $scope.newPage = $scope.book.pages_num;
    }
  
    BooksFactory.getPageContent(bookId, $scope.newPage).then(function(response) {
      $scope.content = decodeURIComponent(response.data.content);
    });

    $scope.page = $scope.newPage;
  }

}]);
