'use strict';

// provides local storage for outlines
outlinear.factory('outlineLocalStorage', function() {
    var STORAGE_ID_PREFIX = 'outlinear-';
    return {
        get: function(name) {
            return JSON.parse(localStorage.getItem(STORAGE_ID_PREFIX + name) ||
                              '[]');
        },
        put: function(name, data) {
            localStorage.setItem(STORAGE_ID_PREFIX + name,
                                 JSON.stringify(data));
        }
    }
});
