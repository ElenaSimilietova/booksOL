angular.module('PageContentModule', [])
.directive('pageContent', [ '$compile', '$rootScope', function($compile, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            content: '=content'
        },
        link: function(scope, element, attrs) {
            scope.$watch('content', function(newValue, oldValue) {
                if (newValue) {
                    element.html(newValue);
                }
            }, true);
        }
    }
    
}]);

