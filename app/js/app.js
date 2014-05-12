'use strict';

var VERSION = '1.0b';

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var ol = angular.module('ol',
                        ['ngRoute',
                         'ol.keyBindingDirective',
                         'ol.contentEditableDirective',
                         'ol.titleAutocompleteDirective']);

// routing
ol.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider, OutlineCtrl) {
        $locationProvider.html5Mode(false);
        $routeProvider.when(':id', {controller: 'OutlineCtrl'});
    }]
);
