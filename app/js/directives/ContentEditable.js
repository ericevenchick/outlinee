var contentEditableDirective =
    angular.module('ol.contentEditableDirective',
    []);

contentEditableDirective.directive('contenteditable', function() {
    'use strict';
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) {
                return;
            }

            // update the view
            ngModel.$render = function() {
                element.html(ngModel.$modelValue.str || '');
            };

            // update the model
            element.bind('blur changed keydown', function() {
                read();
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });
            // initialize
            read();

            // write data to model
            function read() {
                ngModel.$modelValue.str = element.html();
            }

            // event to cause save when bluring
            element.bind('blur', function() {
                scope.$emit('outlineItemBlur');
            });
        }
    };
});
