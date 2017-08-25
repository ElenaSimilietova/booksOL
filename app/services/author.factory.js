var app = angular.module("AuthorFactoryModule", []);

app.factory('Author', ['$http', function($http) {

    var urlBase = '/api/authors';
    var Author = {};

    Author.getMostPopular = function(num) {
        return $http.get(urlBase + '/popular/' + num);
    }

    return Author;
}]);
