'use strict';

// Declare app level module which depends on views, and components
angular.module('booksOL', [
  'ngRoute',
  'MainModule',
  'BookModule',
  'SearchModule',
  'SearchResultsModule',
  'SearchFactoryModule',
  'SignInModule',
  'CreateAccountModule',
  'ProfileModule',
  'AdminModule',
  'BookFactoryModule',
  'PopularAuthorsModule',
  'AuthorFactoryModule',
  'GenresModule',
  'GenreFactoryModule',
  'OnEnterModule',
  'PageContentModule',
  'UserFactoryModule',
  'AccountLinksModule',
  'ReadingListServiceModule'
])
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('');

  $routeProvider.otherwise({redirectTo: '/main'});
}])
.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
  // For checking object size in views
  $rootScope.keys = Object.keys;
  
  var original = $location.path;
  $location.path = function (path, reload) {
      if (reload === false) {
          var lastRoute = $route.current;
          var un = $rootScope.$on('$locationChangeSuccess', function () {
              $route.current = lastRoute;
              un();
          });
      }
      return original.apply($location, [path]);
  };
}]);
