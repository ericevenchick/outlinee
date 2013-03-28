'use strict';

var titleAutocompleteDirective =
    angular.module('ol.titleAutocompleteDirective',
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
            // update the autocomplete contents when dropbox is available
            scope.$on('dropboxConnected', function() {
                element.autocomplete({
                    source: scope.outlineTitleList,
                    select: function() {
                        setTimeout(function() {
                            element.trigger('input');
                        }, 0);
                    }
                });
            });

        }
    }
});
