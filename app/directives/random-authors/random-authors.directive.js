angular.module('randomAuthorsModule', ['authorFactoryModule'])
.directive('randomAuthors', function() {
    return {
        restrict: 'AE',
        controller: controller, 
        scope: true,
        templateUrl: './directives/random-authors/index.html'
    };

    function controller($scope, Author) {
        $scope.message = null;
        Author.getRandom(5).then(function(response) {
            $scope.authors = response.data;
        }, function() {
            $scope.message = 'Sorry, but something went wrong.';
        });
    }
});