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

    UsersFactory.signInUser = function(user) {
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

     UsersFactory.paymentPeriod = function(token,period) {
        
        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/profile',
            data: $.param({value: period.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    UsersFactory.getPayment = function(email) {
        return $http.get(urlBase + '/payment/' + email);
    }

    UsersFactory.logOutUser = function(token) {

        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/log-out',
            data: $.param({}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    return UsersFactory;
}]);