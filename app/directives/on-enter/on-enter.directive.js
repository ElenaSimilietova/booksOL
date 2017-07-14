angular.module('OnEnterModule', [])
.directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress keyup", function (event) {
            if(event.keyCode === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.onEnter);
                });

                event.preventDefault();
            }
        });
    };
});