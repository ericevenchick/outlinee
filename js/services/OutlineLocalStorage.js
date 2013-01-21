'use strict';

// provides local storage for outlines
outlinear.factory('outlineLocalStorage', function() {
    var STORAGE_ID_PREFIX = 'outlinear-';
    return {
        get: function(name) {
            if (!name) return;
            name = name.toLowerCase();
            return JSON.parse(localStorage.getItem(STORAGE_ID_PREFIX + name) ||
                              '[]');
        },
        put: function(name, data) {
            if (!name) return;
            name = name.toLowerCase();
            localStorage.setItem(STORAGE_ID_PREFIX + name,
                                 JSON.stringify(data));
        },
        // get the names of all outlines
        getOutlines: function() {
            var keys = []
            for (var key in localStorage) {
                var keySplit = key.split('-')
                // check that key is an outline
                if (keySplit[0] == "outlinear") {
                    keys.push(keySplit[1]);
                }
            }
            return keys;
        }
    }
});
