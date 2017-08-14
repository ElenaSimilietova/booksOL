var app = angular.module("SearchFactoryModule", []);

app.factory('SearchFactory', ['$http', function($http) {

    var urlBase = '/api/search';
    var SearchFactory = {};

    SearchFactory.search = function(searchString) {
        return $http.get(urlBase + '/' + searchString);
    }

    return SearchFactory;
}]);
