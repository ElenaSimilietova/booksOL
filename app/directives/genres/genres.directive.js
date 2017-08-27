angular.module('genresModule', ['genreFactoryModule'])
.directive('genres', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        scope: true,
        templateUrl: './directives/genres/index.html'
    };

    function controller($scope, Genre) {
        $scope.message = null;
        Genre.getAll().then(function(response) {
            $scope.genres = response.data;
        }, function(reason) {
            $scope.message = 'Sorry, but something went wrong.';
        });    
    }
});