angular.module('GenresModule', ['GenresFactoryModule'])
.directive('genres', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        templateUrl: './directives/genres/index.html'
    };

    function controller($scope, GenresFactory) {
      $scope.genres = GenresFactory.getAll(); 
    }
});