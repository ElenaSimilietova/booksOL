var app = angular.module("BooksFactoryModule", []);

app.factory('BooksFactory', ['$http', function($http) {

    var urlBase = '/api/books';
    var BooksFactory = {};

    BooksFactory.getBook = function(id) {
        var book = {
                        'id': 1,
                        'name': 'Book1',
                        'author': 'Author1',
                        'genre': 'Genre1',
                        'description': 'blah blah blah' 
                    };
        return book;
        //return $http.get('/' + id);
    };

    BooksFactory.getMostPopular = function(num) {
        var books = [
            {
                'id': 1,
                'name': 'Book1',
                'author': 'Author1' 
            },
            {
                'id': 2,
                'name': 'Book2',
                'author': 'Author2' 
            },
            {
                'id': 3,
                'name': 'Book3',
                'author': 'Author3' 
            },
            {
                'id': 4,
                'name': 'Book4',
                'author': 'Author4' 
            }
        ];

        return books;
        //return $http.get(urlBase + '/popular/' + num);
    }

    return BooksFactory;
}]);
