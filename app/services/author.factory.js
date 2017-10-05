var app = angular.module("authorFactoryModule", []);

app.factory('Author', ['$http', function($http) {

    var urlBase = '/api/authors';
    var Author = {};

    Author.saveAuthor = function(author) {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http({
            method: 'POST',
            url: urlBase + '/save',
            data: $.param({
                author: encodeURIComponent(author)
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    Author.getRandom = function(num) {
        return $http.get(urlBase + '/random/' + num);
    }

    Author.getAll = function() {
        return $http.get(urlBase + '/all');
    }

    return Author;
}]);
