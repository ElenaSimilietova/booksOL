angular.module('searchModule', ['onEnterModule'])
.directive('search', function() {
    return {
        restrict: 'AE',
        controller: controller,
        templateUrl: './directives/search/index.html'
    };

    function controller($scope, $location) {
        $scope.doSearch = function() { 
            if ($scope.searchString != '') {
                var searchStr = $scope.searchString;
                $scope.searchString = '';
                document.getElementById("search").blur();
                $location.path('/search-results/' + encodeURIComponent(searchStr));
            }
        }    
    }
});