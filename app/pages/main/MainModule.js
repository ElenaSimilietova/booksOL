'use strict';

angular.module('MainModule', ['ngRoute', 'BooksFactoryModule', 'PopularAuthorsModule', 'GenresModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'pages/main/MainView.html',
    controller: 'MainController'
  });
}])

.controller('MainController', ['$scope', 'BooksFactory', function($scope, BooksFactory) {

  $scope.books = BooksFactory.getMostPopular(6);

}]);

