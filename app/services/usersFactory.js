var app = angular.module("UsersFactoryModule", []);

app.factory('UsersFactory', ['$http', function($http) {

    var urlBase = '/api/users';
    var UsersFactory = {};

    UsersFactory.checkEmail = function(email) {
        return $http.get(urlBase + '/email/check/' + email);
    }

    UsersFactory.saveUser = function(user) {
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

    return UsersFactory;
}]);