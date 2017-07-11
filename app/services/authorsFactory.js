var app = angular.module("AuthorsFactoryModule", []);

app.factory('AuthorsFactory', ['$http', function($http) {

    var urlBase = '/api/authors';
    var AuthorsFactory = {};

    AuthorsFactory.getMostPopular = function(num) {
        var authors = [
            {
                'id': 1,
                'name': 'Author1'
            },
            {
                'id': 2,
                'name': 'Author2',
            },
            {
                'id': 3,
                'name': 'Author3',
            },
            {
                'id': 4,
                'name': 'Author4',
            }
        ];

        return authors;
        //return $http.get(urlBase + '/popular/' + num);
    }

    return AuthorsFactory;
}]);


/*
var app = angular.module("BooksFactoryModule", []);

app.factory('BooksFactory', ['$http', function($http) {

    var urlBase = '/api/books';
    var BooksFactory = {};

    BooksFactory.getMostPopular = function(num) {
        return $http.get(urlBase + '/popular/' + num);
    }

    return BooksFactory;
}]);
*/
