'use strict';

angular.module('SearchResultsModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search-results', {
    templateUrl: 'pages/searchResults/SearchResultsView.html',
    controller: 'SearchResultsController'
  });
}])

.controller('SearchResultsController', [function() {

}]);