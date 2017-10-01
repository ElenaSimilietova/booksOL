angular.module('accountLinksModule', ['userFactoryModule'])
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
                $scope.isAdmin = false;
                
                if((token && expiresIn) && (expiresIn > Date.now())) {
                    $scope.isSignedIn = true;

                    var tokenArr = token.split('.');
                    var payload = JSON.parse(atob(tokenArr[1]));

                    if (payload.role == 'administrator') {
                        $scope.isAdmin = true;
                    }
                } 
            });
        }
    };
}]);