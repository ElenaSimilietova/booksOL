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

    User.paymentPeriod = function(token,period) {
        
        $http.defaults.headers.post['access-token'] = token;

        return $http({
            method: 'POST',
            url: urlBase + '/profile',
            data: $.param({value: period.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }


    User.getPayment = function(email) {
        return $http.get(urlBase + '/payment/' + email);
    }


    return User;
}]);