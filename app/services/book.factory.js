var app = angular.module("bookFactoryModule", []);

app.factory('Book', ['$http', function($http) {

    var urlBase = '/api/books';
    var Book = {};

    Book.getBook = function(id) {
        return $http.get(urlBase + '/id/' + id);
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

    Book.getBooksByLetter = function(letter) {
      $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
      return $http.get(urlBase + '/letter/' + letter);
    };

    Book.getBooksMappingByLetter = function() {
      $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
      return $http.get(urlBase + '/letter');
    };

    Book.delete = function(id) {
      $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
      // send user data
      return $http({
          method: 'DELETE',
          url: urlBase + '/delete',
          data: {
              id: id
          },
          headers: {
              'Content-type': 'application/json;charset=utf-8'
          }
      });
    };

    return Book;
}]);