angular.module('genresModule', ['genreFactoryModule'])
.directive('genres', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        scope: true,
        templateUrl: './directives/genres/index.html'
    };

    function controller($scope, Genre) {
        Genre.getAll().then(function(response) {
            $scope.genres = response.data;
        });    
    }
});