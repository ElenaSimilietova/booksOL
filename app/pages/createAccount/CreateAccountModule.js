'use strict';

angular.module('CreateAccountModule', ['ngRoute', 'UserFactoryModule'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/users/create-account', {
    templateUrl: 'pages/createAccount/CreateAccountView.html',
    controller: 'CreateAccountController'
  })
  .when('/users/create-account/success/:name', {
    templateUrl: 'pages/createAccount/CreateAccountSuccessView.html',
    controller: 'CreateAccountSuccessController'
  })
  .when('/users/create-account/fail', {
    templateUrl: 'pages/createAccount/CreateAccountFailView.html',
    controller: 'CreateAccountFailController'
  });
}])

.controller('CreateAccountController', ['$scope', '$location', 'User', function($scope, $location, User) {
  $scope.firstName = {'value': '',
                      'pattern': /^[a-z ,.'-]+$/i,
                      'message': 'Invalid first name'
  };

  $scope.lastName = {'value': '',
                      'pattern': /^[a-z ,.'-]+$/i,
                      'message': 'Invalid last name'
  };

  $scope.email = {'value': '',
                  'pattern': /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  'messageValid': 'Invalid email',
                  'messageExists': 'This email already exists'
  };

  $scope.password1 = {'value': '',
                      'pattern': /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/,
                      'message': 'Invalid password. Should be at least 6 characters, containing at least one lowercase letter, '+
                                  'at least one uppercase letter, at least 1 number'
  };

  $scope.password2 = {'value': '',
                      'pattern': /^\S*(?=\S{6,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/,
                      'messageValid': 'Invalid password',
                      'messageMatch': 'Passwords don\'t match'
  };

  $scope.doPasswordsMatch = true;
  $scope.doesEmailExist = false;

  $scope.emailValidate = function(isEmailValid) {
    if (isEmailValid) {
      User.checkEmail($scope.email.value).then(function(response) {
        var count = response.data.count;
        if (count > 0) {
          $scope.doesEmailExist = true;
        } else {
          $scope.doesEmailExist = false;
        }
      });
    }
  }

  $scope.passwordValidate = function() {
    if ($scope.password1.value != $scope.password2.value) {
      $scope.doPasswordsMatch = false;
    }
    else {
      $scope.doPasswordsMatch = true;
    }
  }

  $scope.submitForm = function(isFormValid) {
    if (isFormValid && !$scope.doesEmailExist && $scope.doPasswordsMatch) {
      var user = {
                  'firstName': $scope.firstName.value,
                  'lastName': $scope.lastName.value,
                  'email': $scope.email.value,
                  'password': $scope.password1.value,
                  'role': 2 
      };

      User.saveUser(user).then(function(response) {
        var path = '';
        if (response.status == 200) {
          path = '/success/' + encodeURIComponent(user.firstName + ' ' + user.lastName);
        } else {
          path = '/fail';
        }
        $location.path('/users/create-account' + path); 
        
      });
    }
    else {
      angular.forEach($scope.createAccountForm.$error.required, function(field) {
          field.$setDirty();
      });
    }
  }

}])

.controller('CreateAccountSuccessController', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.name = decodeURIComponent($routeParams.name);
}])

.controller('CreateAccountFailController', ['$scope', function($scope) {
}]);