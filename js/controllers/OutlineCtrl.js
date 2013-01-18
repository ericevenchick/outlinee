'use strict';

outlinear.controller('OutlineCtrl',
                     function outlineCtrl($scope, outlineLocalStorage)
{
    // constants
    var INDENT_SIZE = 40;
    var MAX_INDENT = 30;

    // by default, start with one element (new outline)
    $scope.content = [{str:"", ind:0}];

    // watch for content changes, save on change
    $scope.$watch('content', function() {
        outlineLocalStorage.put($scope.outlineTitle, $scope.content);
    }, true);

    // watch for title changes, load on change
    $scope.$watch('outlineTitle', function() {
        var loaded = outlineLocalStorage.get($scope.outlineTitle);
        // if there's data to load, load it
        // if not, create a single element (new outline)
        if (loaded.length)
            $scope.content = loaded;
        else
            $scope.content = [{str:"", ind:0}];
    });

    // create a title for the page
    $scope.pageTitle = function() {
        return $scope.outlineTitle ? ($scope.outlineTitle + " | outlinear") :
                                     ("outlinear");
    }

    // given an input element, focus the next input element
    $scope.focusNext = function(el) {
        $(el).parent().next().find('input').focus();
    }

    // given an input element, focus the previous element
    $scope.focusPrev = function(el) {
        $(el).parent().prev().find('input').focus();
    }

    // get the index of an input element
    $scope.getInputIndex = function(el) {
        // get input element's parent li
        var li = $(el).parent();
        return li.index();
    }

    // set the indent level of a line
    $scope.setIndent = function(el, indent) {
        // do nothing if indent is not valid
        if (indent < 0 || indent > MAX_INDENT)
            return;

        var index = $scope.getInputIndex(el);

        // get the current indent level
        var curIndent = $scope.content[index].ind;

        // set the new indent level
        $scope.content[index].ind = indent;
        // apply style on parent li
        var li = $(el).parent();
        li.css('margin-left', (indent * INDENT_SIZE) + "px");
        // update the view
        $scope.$apply();
    }

    // increase line's indent level by 1
    $scope.increaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
        // increase indent level of line
        $scope.setIndent(el, $scope.content[index].ind + 1);
    }

    // decrease line's indent level by 1
    $scope.decreaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
        // decrease indent level of line
        $scope.setIndent(el, $scope.content[index].ind - 1);
    }

    // insert a line after an input element's line
    $scope.insertLineAfter = function(el) {
        var index = $scope.getInputIndex(el);
        // add an element after the current one
        $scope.content.splice(index + 1, 0, {
            str: "",
            ind:0
        });
        // poke the view
        $scope.$apply();
        // set the indent to the current element's indent
        // need to pass input element, which is the only child of the next li
        $scope.setIndent($(el).parent().next().children(),
                         $scope.content[index].ind);
    }

    // delete a line given its input element
    $scope.deleteLine = function(el) {
        // only allow a delete if there's more than one line left!
        if ($scope.content.length < 2)
            return;

        var index = $scope.getInputIndex(el);
        $scope.content.remove(index);
        // choose element to focus before view gets updates
        // otherwise we can't find it
        if (index > 0)
            var toFocus = $(el).parent().prev().children();
        else
            var toFocus = $(el).parent().next().children();

        // poke the view
        $scope.$apply();
        // apply focus
        toFocus.focus();
    }
})
