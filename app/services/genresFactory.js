var app = angular.module("GenresFactoryModule", []);

app.factory('GenresFactory', ['$http', function($http) {

    var urlBase = '/api/genres';
    var GenresFactory = {};

    GenresFactory.getAll = function() {
        return $http.get(urlBase);
    }

    return GenresFactory;
}]);
