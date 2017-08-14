'use strict';

angular.module('SearchResultsModule', ['ngRoute', 'SearchFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search-results/:str', {
    templateUrl: 'pages/searchResults/SearchResultsView.html',
    controller: 'SearchResultsController'
  });
}])

.controller('SearchResultsController', ['$scope','$routeParams', 'SearchFactory', function($scope, $routeParams, SearchFactory) {
  var searchString = $routeParams.str;
  $scope.authors = {};
  $scope.books = {};
  
  SearchFactory.search(searchString).then(function(response) {
    $scope.authors = response.data.authors;
    $scope.books = response.data.books;
    $scope.message = null;
    if ((Object.keys($scope.authors).length == 0) && (Object.keys($scope.books).length == 0)) {
      $scope.message = 'Sorry, no results';
    } else {

    }
    $scope.searchString = decodeURIComponent(searchString);
  }, function(reason) {
    // rejection
    $scope.message = "Error. Something went wrong.";
  });
  
}]);