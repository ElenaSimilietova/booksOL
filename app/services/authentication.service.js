var app = angular.module("authenticationServiceModule", []);

app.service('AuthenticationService', ['$http', function($http) {

    var urlBase = '/api';
    var AuthenticationService = {};

    AuthenticationService.signInUser = function(user) {
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

    AuthenticationService.logOutUser = function(token) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $http.defaults.headers.post['access-token'] = sessionStorage.getItem('token');

        return $http({
            method: 'POST',
            url: urlBase + '/log-out',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    return AuthenticationService;
}]);