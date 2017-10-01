var app = angular.module("genreFactoryModule", []);

app.factory('Genre', ['$http', function($http) {

    var urlBase = '/api/genres';
    var Genre = {};

    Genre.saveGenre = function(genre) {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http({
            method: 'POST',
            url: urlBase + '/save',
            data: $.param({
                genre: encodeURIComponent(genre)
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    Genre.getAll = function() {
        return $http.get(urlBase);
    }

    return Genre;
}]);
