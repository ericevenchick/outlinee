var titleAutocompleteDirective =
    angular.module('ol.titleAutocompleteDirective',
    []);

titleAutocompleteDirective.directive('olTitleAutocomplete', function() {
    'use strict';
    return {
        link: function(scope, element) {
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
    };
});

