var app = angular.module("userFactoryModule", []);

app.factory('User', ['$http', function($http) {

    var urlBase = '/api/users';
    var User = {};

    User.checkEmail = function(email) {
        return $http.get(urlBase + '/email/check/' + email);
    }

    User.saveUser = function(user) {
        // default post header
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // send user data
        return $http({
            method: 'POST',
            url: urlBase + '/save',
            data: $.param({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                role: user.role
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    User.getUser = function() {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get('/api/user');
    }

    User.subscribe = function(subscribeDueDate) {
        $http.defaults.headers.put['access-token'] = sessionStorage.getItem('token');
        return $http({
            method: 'PUT',
            url: urlBase + '/subscription/',
            data: $.param({subscribeDueDate: subscribeDueDate.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    User.getDueDate = function() {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get(urlBase + '/subscription/getDueDate');
    };

    return User;
}]);