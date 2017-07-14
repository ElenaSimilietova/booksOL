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

  $scope.books = SearchFactory.search(searchString);
  /*
  SearchFactory.search(searchString).then(function(response) {
    $scope.books = response.data;
  });*/
  
}]);