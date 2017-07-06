'use strict';

angular.module('CreateAccountModule', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create-account', {
    templateUrl: 'pages/createAccount/CreateAccountView.html',
    controller: 'CreateAccountController'
  });
}])

.controller('CreateAccountController', [function() {

}]);