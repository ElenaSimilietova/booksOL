angular.module('popularAuthorsModule', ['authorFactoryModule'])
.directive('popularAuthors', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        scope: true,
        templateUrl: './directives/popular-authors/index.html'
    };

    function controller($scope, Author) {
        Author.getMostPopular(5).then(function(response) {
            $scope.authors = response.data;
        });
    }
});