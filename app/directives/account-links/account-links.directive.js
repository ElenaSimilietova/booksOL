angular.module('accountLinksModule', ['userFactoryModule'])
.directive('accountLinks', ['$location', 'User', function(location, User) {
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

                    User.getUser().then(function(result) {
                        $scope.profileLabel = result.data.email;
                    }, function(reason) {
                        if (payload.role == 'administrator') {
                            $scope.profileLabel = 'Go to dashboard';
                        } else {
                            $scope.profileLabel = 'Go to profile';
                        }
                    });
                } 
            });
        }
    };
}]);