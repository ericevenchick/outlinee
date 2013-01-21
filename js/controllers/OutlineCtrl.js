'use strict';

outlinear.controller('OutlineCtrl',
                     function outlineCtrl($scope, outlineLocalStorage)
{
    // constants
    var INDENT_SIZE = 40;
    var MAX_INDENT = 30;

    // by default, start with one element (new outline)
    $scope.content = [{str:"bc", ind:0},{str:"de",ind:0}];

    // watch for content changes, save on change
    $scope.$watch('content', function() {
        // only save if the title is defined and if there is content
        if ($scope.outlineTitle && $scope.content.length > 0) {
            outlineLocalStorage.put($scope.outlineTitle, $scope.content);
        }
    }, true);

    // watch for title changes, load on change
    $scope.$watch('outlineTitle', function() {
        var loaded = outlineLocalStorage.get($scope.outlineTitle);
        // if there's data to load, load it
        // if not, create a single element (new outline)
        if (loaded && loaded.length > 0) {
            $scope.content = loaded;
        } else {
            $scope.content = [{str:"", ind:0}];
        }
    });

    // create a style for each line based on its content
    $scope.styleForLine = function(line) {
        // set the margin based on indent
        return ("margin-left: " + INDENT_SIZE * line.ind + "px;");
    }

    // create a title for the page
    $scope.pageTitle = function() {
        return $scope.outlineTitle ? ($scope.outlineTitle + " | outlinear") :
                                     ("outlinear");
    }

    // given an element, focus the next div element
    $scope.focusNext = function(el) {
        $(el).parent().next().find('div').focus();
    }

    // given an element, focus the previous div element
    $scope.focusPrev = function(el) {
        $(el).parent().prev().find('div').focus();
    }

    // get the index of a div element
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
        // update the view
        $scope.$apply();
    }

    // increase line's indent level by 1
    $scope.increaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
        $scope.setIndent(el, $scope.content[index].ind + 1);
    }

    // decrease line's indent level by 1
    $scope.decreaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
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
