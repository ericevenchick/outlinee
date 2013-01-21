'use strict';

var titleAutocompleteDirective =
    angular.module('outlinear.titleAutocompleteDirective',
    []);

titleAutocompleteDirective.directive('olTitleAutocomplete', function() {
    return {
        link: function(scope, element, attrs) {
            element.autocomplete({
                source: scope.outlineTitleList,
                select: function() {
                    setTimeout(function() {
                        element.trigger('input');
                    }, 0);
                }
            });
        }
    }
});

