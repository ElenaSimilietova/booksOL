var app = angular.module("UserFactoryModule", []);

app.factory('User', ['$http', function($http) {

    var urlBase = '/api/users';
    var UsersFactory = {};

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

    User.signInUser = function(user) {
        // default post header
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        // send user data
        return $http({
            method: 'POST',
            url: urlBase + '/sign-in',
            data: $.param({
                email: user.email,
                password: user.password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    User.logOutUser = function(token) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/log-out',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    return User;
}]);