'use strict';

angular.module('searchResultsModule', ['ngRoute', 'searchFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search-results/:str', {
    templateUrl: 'pages/searchResults/searchResults.html',
    controller: 'SearchResultsController'
  });
}])

.controller('SearchResultsController', ['$scope','$routeParams', 'Search', function($scope, $routeParams, Search) {
  var searchString = $routeParams.str;
  $scope.authors = {};
  $scope.books = {};
  $scope.message = null;
  
  Search.search(searchString).then(function(response) {
    $scope.authors = response.data.authors;
    $scope.books = response.data.books;
    
    if ((Object.keys($scope.authors).length == 0) && (Object.keys($scope.books).length == 0)) {
      $scope.message = 'Sorry, no results';
    } 
    
    $scope.searchString = decodeURIComponent(searchString);
  }, function(reason) {
    // rejection
    $scope.message = "Error. Something went wrong.";
  });
  
}]);