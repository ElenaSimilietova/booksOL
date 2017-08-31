var app = angular.module("subscriptionServiceModule", []);

app.service('SubscriptionService', ['$http', function($http) {

    var urlBase = '/api/subscription';
    var SubscriptionService = {};

    SubscriptionService.subscribe = function(subscribeDueDate) {
        $http.defaults.headers.put['access-token'] = sessionStorage.getItem('token');
        return $http({
            method: 'PUT',
            url: urlBase,
            data: $.param({subscribeDueDate: subscribeDueDate.value}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
    }

    SubscriptionService.getDueDate = function() {
        $http.defaults.headers.common['access-token'] = sessionStorage.getItem('token');
        return $http.get(urlBase + '/getDueDate');
    };

    return SubscriptionService;
}]);