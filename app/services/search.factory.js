var app = angular.module("searchFactoryModule", []);

app.factory('Search', ['$http', function($http) {

    var urlBase = '/api/search';
    var Search = {};

    Search.search = function(searchString) {
        return $http.get(urlBase + '/' + searchString);
    }

    return Search;
}]);
