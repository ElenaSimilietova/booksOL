var app = angular.module("GenreFactoryModule", []);

app.factory('Genre', ['$http', function($http) {

    var urlBase = '/api/genres';
    var Genre = {};

    Genre.getAll = function() {
        return $http.get(urlBase);
    }

    return Genre;
}]);
