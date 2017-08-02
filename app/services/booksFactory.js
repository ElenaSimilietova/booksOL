var app = angular.module("BooksFactoryModule", []);

app.factory('BooksFactory', ['$http', function($http) {

    var urlBase = '/api/books';
    var BooksFactory = {};

    BooksFactory.getBook = function(id) {
        return $http.get(urlBase + '/' + id);
    };

    BooksFactory.getInfo = function(id) {
        return $http.get(urlBase + '/info/' + id);
    };

    BooksFactory.getPageContent = function(id, pageNum) {
        return $http.get(urlBase + '/content/' + id + '/' + pageNum);
    };

    BooksFactory.getMostPopular = function(num) {
        
       return $http.get(urlBase + '/popular/' + num);
    }

    return BooksFactory;
}]);