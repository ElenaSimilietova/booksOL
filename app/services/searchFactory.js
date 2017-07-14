var app = angular.module("SearchFactoryModule", []);

app.factory('SearchFactory', ['$http', function($http) {

    var urlBase = '/api/search';
    var SearchFactory = {};

    SearchFactory.search = function(searchString) {
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

        //return $http.get(urlBase + '/' + searchString);
    }

    return SearchFactory;
}]);
