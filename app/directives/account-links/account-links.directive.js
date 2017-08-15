angular.module('AccountLinksModule', ['UsersFactoryModule'])
.directive('accountLinks', ['$location', function(location) {
    return {
        restrict: 'AE',
        templateUrl: './directives/account-links/index.html',
        link: function($scope, $element, $attrs) {
            $scope.$location = location;
            $scope.$watch('$location.path()', function(locationPath) {
                var token = sessionStorage.getItem('token');
                var expiresIn = sessionStorage.getItem('expiresIn');
                $scope.isSignedIn = false;

                if((token && expiresIn) && (expiresIn > Date.now())) {
                    $scope.isSignedIn = true;
                } 
            });
        }
    };
}]);