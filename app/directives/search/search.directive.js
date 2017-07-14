angular.module('SearchModule', ['OnEnterModule'])
.directive('search', function() {
    return {
        restrict: 'AE',
        controller: controller,
        templateUrl: './directives/search/index.html'
    };

    function controller($scope, $location) {
        $scope.doSearch = function() { 
            if ($scope.searchString != '') {
                $location.path('/search-results/' + encodeURIComponent($scope.searchString));
            }
        }    
    }
});