'use strict';


// provides local storage for outlines
outlinear.factory('outlineLocalStorage', function() {
    var DEMO_OUTLINE = [
        {str:"This is Outlinear", ind:0},
        {str:"It's an outliner note taking program.", ind:1},
        {str:"It's designed for:", ind:1},
        {str:"Taking notes", ind:2},
        {str:"Tracking tasks", ind:2},
        {str:"Or whatever else you'd like to use it for.", ind:2},
        {str:"The key bindings:", ind:0},
        {str:"Enter = add new element", ind:1},
        {str:"Up = move up", ind:1},
        {str:"Down = move down", ind:1},
        {str:"Tab = increase indent", ind:1},
        {str:"Shift+Tab = decrease indent", ind:1},
        {str:"Control+Up = move element up", ind:1},
        {str:"Control+Down = move element down", ind:1},
        {str:"Delete = delete element", ind:1},
        {str:"Control+S = strikethrough element", ind:1},
        {str:"Autosaving", ind:0},
        {str:"Give your outline a name in the top text box.", ind:1},
        {str:"Outlinear autosaves when you change things.", ind:1},
        {str:"To open an outline just enter its name in the box.", ind:1},
        {str:"Right now, it's all kept in local storage for your browser.", ind:1},
        {str:"Dropbox support coming soon!", ind:1},
        {str:"More Info!", ind:0},
        {str:"Outlinear is written in HTML and JS, using AngularJS.", ind:1},
        {str:"It's open source, and on Github:", ind:1},
        {str:"https://github.com/ericevenchick/outlinear", ind:2},
        {str:"It's by Eric Evenchick", ind:1},
        {str:"Who you can find at evenchick.com", ind:2},
        {str:"or on Twitter (@ericevenchick)", ind:2},
        {str:"Feedback is appreciated :)", ind:2},
        ];

    var STORAGE_ID_PREFIX = 'outlinear-';
    return {
        get: function(name) {
            if (!name) return;
            name = name.toLowerCase();

            // return the demo if requested
            if (name == 'demo')
            {
                return DEMO_OUTLINE;
            }

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

            // add a key for the demo
            keys.push('demo');

            // make sure that the demo key only appears once
            // and get all the keys
            for (var key in localStorage && key != 'demo') {
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
