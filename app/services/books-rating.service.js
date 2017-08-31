var app = angular.module("booksRatingServiceModule", []);

app.service('BooksRating', ['$http', function($http) {

    var urlBase = '/api/books/rating';
    var BooksRating = {};

    BooksRating.savePoints = function(bookID, value) {
        // default post header
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.post['access-token'] = sessionStorage.getItem('token');
        // send user data
        return $http({
            method: 'POST',
            url: urlBase,
            data: $.param({
                bookID: bookID,
                rating: value
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    return BooksRating;
}]);