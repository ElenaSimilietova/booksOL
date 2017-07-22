var app = angular.module("AuthorsFactoryModule", []);

app.factory('AuthorsFactory', ['$http', function($http) {

    var urlBase = '/api/authors';
    var AuthorsFactory = {};

    AuthorsFactory.getMostPopular = function(num) {
        return $http.get(urlBase + '/popular/' + num);
    }

    return AuthorsFactory;
}]);
