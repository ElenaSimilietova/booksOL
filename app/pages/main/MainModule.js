'use strict';

angular.module('MainModule', ['ngRoute', 'BooksFactoryModule', 'PopularAuthorsModule', 'GenresModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/MainView.html',
    controller: 'MainController'
  });
}])

.controller('MainController', ['$scope', 'BooksFactory', function($scope, BooksFactory) {

  BooksFactory.getMostPopular(6).then(function(response) {
    $scope.books = response.data;
  });

}]);

