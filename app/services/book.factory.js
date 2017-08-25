var app = angular.module("BookFactoryModule", []);

app.factory('Book', ['$http', function($http) {

    var urlBase = '/api/books';
    var Book = {};

    Book.getBook = function(id) {
        return $http.get(urlBase + '/' + id);
    };

    Book.getGeneralInfo = function(id) {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get(urlBase + '/info/' + id);
    };

    Book.getPageContent = function(id, pageNum) {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get(urlBase + '/content/' + id + '/' + pageNum);
    };

    Book.getMostPopular = function(num) {
      return $http.get(urlBase + '/popular/' + num);
    };

    Book.getBooksByGenre = function(id) {
      return $http.get(urlBase + '/genre/' + id);
    };

    Book.getBooksByAuthor = function(id) {
      return $http.get(urlBase + '/author/' + id);
    };

    return Book;
}]);