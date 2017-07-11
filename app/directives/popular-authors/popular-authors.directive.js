angular.module('PopularAuthorsModule', ['AuthorsFactoryModule'])
.directive('popularAuthors', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        templateUrl: './directives/popular-authors/index.html'
    };

    function controller($scope, AuthorsFactory) {
      $scope.authors = AuthorsFactory.getMostPopular(5);
    }
});