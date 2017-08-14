angular.module('GenresModule', ['GenresFactoryModule'])
.directive('genres', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        scope: true,
        templateUrl: './directives/genres/index.html'
    };

    function controller($scope, GenresFactory) {
        GenresFactory.getAll().then(function(response) {
            $scope.genres = response.data;
        });    
    }
});