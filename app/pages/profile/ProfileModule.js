'use strict';

angular.module('profileModule', ['ngRoute', 'userFactoryModule', 'subscriptionServiceModule', 'readingListServiceModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/profile', {
    templateUrl: 'pages/profile/profile.html',
    controller: 'ProfileController'
  });
}])

.controller('ProfileController', ['$scope','$location', 'User', 'SubscriptionService', 'ReadingList', function($scope, $location, User, SubscriptionService, ReadingList) {
  var token = sessionStorage.getItem('token');
  var expiresIn = sessionStorage.getItem('expiresIn');

  if (!token || !expiresIn || expiresIn < Date.now()) {
    $location.path('/sign-in');
  };

  User.getUser().then(function(response) {
    $scope.firstName =  response.data.firstName;
    $scope.dueDate = response.data.dueDate;
    $scope.isSubscriptionValid = (Date.parse($scope.dueDate) > Date.now()) ? true : false;
    
    if (!$scope.isSubscriptionValid) {
      $scope.subscriptionInfo = "Subscribe, if you want to be able to read BooksOL books. You can pay for a month or make annual subscription below:";   
    } else {
      $scope.subscriptionInfo = "Your subscription is valid until ";
    }

    ReadingList.getData().then(function(response) {
      $scope.books = response.data;

    }, function(reason) {

    });


  }, function(reason) {
    // rejection
    if (reason.status == 500) {
      $scope.message = 'Sorry, but something went wrong.';
    } else 
    if (reason.status == 401) {
      $location.path('/sign-in');
    }
  });

  $scope.submitPayment = function(value) {

    var subscribeDueDate = {'value': value};  

    SubscriptionService.subscribe(subscribeDueDate).then(function(response) {

      $scope.dueDate = response.data.dueDate;
      $scope.isSubscriptionValid = (Date.parse($scope.dueDate) > Date.now()) ? true : false;

      if (!$scope.isSubscriptionValid) {
        $scope.subscriptionInfo = "Subscribe, if you want to be able to read BooksOL books. You can pay for a month or make annual subscription below:";   
      } else {
        $scope.subscriptionInfo = "Thank you for the subscription! Your subscription is valid until ";
      }

    });
  }
  
}]);

