var app = angular.module("readingListServiceModule", []);

app.service('ReadingList', ['$http', function($http) {

    var urlBase = '/api/books';
    var ReadingList = {};

    ReadingList.saveBookPage = function(bookID, page) {
        // default post header
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.post['access-token'] = sessionStorage.getItem('token');
        // send user data
        return $http({
            method: 'POST',
            url: urlBase + '/page/save',
            data: $.param({
                bookID: bookID,
                page: page
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    ReadingList.removeBookFromReadingList = function(bookID) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        // send user data
        return $http({
            method: 'DELETE',
            url: urlBase + '/page/delete',
            data: {
                bookID: bookID
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    }

    ReadingList.getData = function() {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get(urlBase + '/readinglist');
    };

    return ReadingList;
}]);