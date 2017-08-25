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
        $http.defaults.headers.post['access-token'] = sessionStorage.getItem('token');

        return $http({
            method: 'POST',
            url: urlBase + '/log-out',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    User.subscribe = function(token, subscribePeriod) {
        
        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/subscription/',
            data: $.param({subscribePeriod: subscribePeriod.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
}

     User.getDueDate = function(token) {
        
        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/subscription/dueDate',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });

    }


    return User;
}]);