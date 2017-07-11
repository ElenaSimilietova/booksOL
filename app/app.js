'use strict';

// Declare app level module which depends on views, and components
angular.module('booksOL', [
  'ngRoute',
  'MainModule',
  'BookModule',
  'SearchModule',
  'SearchResultsModule',
  'SignInModule',
  'CreateAccountModule',
  'ProfileModule',
  'AdminModule',
  'BooksFactoryModule',
  'PopularAuthorsModule',
  'AuthorsFactoryModule',
  'GenresModule',
  'GenresFactoryModule'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider.otherwise({redirectTo: '/main'});
}]);
