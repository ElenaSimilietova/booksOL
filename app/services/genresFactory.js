var app = angular.module("GenresFactoryModule", []);

app.factory('GenresFactory', ['$http', function($http) {

    var urlBase = '/api/genres';
    var GenresFactory = {};

    GenresFactory.getAll = function() {
        var genres = [
            {
                'id': 1,
                'name': 'Genre1'
            },
            {
                'id': 2,
                'name': 'Genre2',
            },
            {
                'id': 3,
                'name': 'Genre3',
            },
            {
                'id': 4,
                'name': 'Genre4',
            }
        ];

        return genres;
        //return $http.get(urlBase);
    }

    return GenresFactory;
}]);
