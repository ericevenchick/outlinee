'use strict';

ol.controller('OutlineCtrl',
                     function outlineCtrl($scope,
                                          localStorageService,
                                          dropboxService,
                                          $location, $window)
{
    // constants
    var INDENT_SIZE = 40;
    var MAX_INDENT = 30;
    var BLANK_OUTLINE = {data:[{str:'', ind:0}]};

    // copy version to scope so it can be displayed
    $scope.version = VERSION;

    // use path to get outline name
    // TODO: this could use real routing rather than substr
    var pathTitle = $location.path().substr(1);
    $scope.outlineTitle = pathTitle ? pathTitle : '';

    // get the names of all the outlines in local storage
    $scope.outlineTitleList = localStorageService.getOutlines();
    // grab the outlines from dropbox
    $scope.$on('dropboxConnected', function() {
        if (dropboxService.isAuthenticated()) {
            $scope.outlineTitleList = dropboxService.getList();
        }
    });

    // watch for content changes, save on change
    $scope.$watch('content', function() {
        // only save if the title is defined and if there is content
        if ($scope.outlineTitle &&
            $scope.outline.data &&
            $scope.outline.data.length > 0 &&
            $scope.outline.data[0].str != '') {
                localStorageService.put($scope.outlineTitle,
                                        $scope.outline);
            }

    }, true);
    // when an item is blured, save to dropbox
    $scope.$on('outlineItemBlur', function() {
        dropboxService.putOutline($scope.outlineTitle, $scope.outline);
    });

    // save when leaving page
    $window.onbeforeunload = function() {
        dropboxService.putOutline($scope.outlineTitle, $scope.outline);
    }

    // watch for title changes, load on change
    $scope.$watch('outlineTitle', function() {
        // start fetching from dropbox
        dropboxService.getOutline($scope, $scope.outlineTitle);

        // load from localStorage if not connected to dropbox
        if (!dropboxService.isAuthenticated()) {
            var loaded = localStorageService.get($scope.outlineTitle);
            // if there's data to load, load it
            // if not, create a single element (new outline)
            if (loaded && loaded.data) {
                $scope.outline.data = loaded;
            } else {
                $scope.outline = BLANK_OUTLINE
            }
            console.log($scope.outline);
        }
    });

    // put data into outline when it's fetched from dropbox
    $scope.$on('dropboxGotOutline', function() {
        var loaded = dropboxService.getOutlineData();
        if (loaded && loaded.data) {
            $scope.outline = loaded;
        } else {
            $scope.outline = BLANK_OUTLINE;
        }
        $scope.$apply();
    });
    // create a title for the page
    $scope.pageTitle = function() {
        return $scope.outlineTitle ? ($scope.outlineTitle + ' | outlinee') :
                                     ('outlinee');
    }

    // create a style for each line
    $scope.styleForLine = function(line) {
        var styles = [];

        // set strikethrough
        if (line.strike) styles.push('text-decoration: line-through');

        // set the margin based on indent
        styles.push('margin-left: ' + INDENT_SIZE * line.ind + 'px');

        // if line is hidden, do not display, take up no space
        if (line.hidden) styles.push('display: none');

        return styles.join('; ');
    }


    // given an element, focus the next div element
    $scope.focusNext = function(el) {
        var index = $scope.getInputIndex(el);

        // not possible if last
        if (index == $scope.outline.data.length - 1) return;

        $('ul li:nth-child(' + (index + 2) + ')').find('div').focus();
    }

    // given an element, focus the previous div element
    $scope.focusPrev = function(el) {
        var index = $scope.getInputIndex(el);

        // not possible if first
        if (index == 0) return;

        // focus the nth div
        $('ul li:nth-child(' + index + ')').find('div').focus();
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
        if (indent < 0 || indent > MAX_INDENT) return;

        var index = $scope.getInputIndex(el);

        // first line must be level 0
        if (index == 0) indent = 0;
        // ensure that indent is no more than 1 greater than previous line
        if (index > 0 && indent > ($scope.outline.data[index - 1].ind + 1)) {
            return;
        }

        // get the current indent level
        var curIndent = $scope.outline.data[index].ind;

        // set the new indent level
        $scope.outline.data[index].ind = indent;
        // update the view
        $scope.$apply();
    }

    // increase line's indent level by 1
    $scope.increaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
        $scope.setIndent(el, $scope.outline.data[index].ind + 1);
    }

    // decrease line's indent level by 1
    $scope.decreaseIndent = function(el) {
        var index = $scope.getInputIndex(el);
        $scope.setIndent(el, $scope.outline.data[index].ind - 1);
    }

    // set strikethrough property of the line
    $scope.toggleStrike = function(el, value) {
        var index = $scope.getInputIndex(el);
        $scope.outline.data[index].strike = !($scope.outline.data[index].strike);
        $scope.$apply();
    }

    // insert a line after an input element's line
    $scope.insertLineAfter = function(el) {
        var index = $scope.getInputIndex(el);
        // add an element after the current one
        $scope.outline.data.splice(index + 1, 0, {
            str: '',
            ind:0
        });
        // poke the view
        $scope.$apply();
        // set the indent to the current element's indent
        // need to pass input element, which is the only child of the next li
        $scope.setIndent($(el).parent().next().children(),
                         $scope.outline.data[index].ind);
    }

    // move a line up one position
    $scope.moveUp = function(el) {
        var index = $scope.getInputIndex(el);

        // not possible if first element
        if (index == 0) return;

        // prevent moving if element above is of lower indent level
        if ($scope.outline.data[index-1].ind <
            $scope.outline.data[index].ind) return;

        // get number of elements to move, which is this element plus number
        // of child elements
        var numElements = 1;
        while (($scope.outline.data[index + numElements]) &&
               ($scope.outline.data[index + numElements].ind >
                $scope.outline.data[index].ind))
        {
            numElements = numElements + 1;
        }
        // number ofchildren of previous element,
        // skip over these when inserting
        var numSkip = 1;
        while (($scope.outline.data[index - numSkip]) &&
               ($scope.outline.data[index - numSkip].ind >
                $scope.outline.data[index].ind))
        {
            numSkip = numSkip + 1;
        }

        // prevent moving if element above is of lower indent level
        if ($scope.outline.data[index-1].ind <
            $scope.outline.data[index].ind) return;


        // perform move
        var temp = $scope.outline.data.splice(index, numElements);
        for (var i = 0; i < temp.length; i++) {
            $scope.outline.data.splice(index - numSkip + i, 0, temp[i]);
        }
        $scope.$apply();

        // refocus the element
        el.focus();
    }

    // move a line down one position
    $scope.moveDown = function(el) {
        var index = $scope.getInputIndex(el);

        // not possible if last element
        if (index == ($scope.outline.data.length - 1)) return;

        // get number of elements to move, which is this element plus number
        // of child elements
        var numElements = 1;
        while (($scope.outline.data[index + numElements]) &&
               ($scope.outline.data[index + numElements].ind >
                $scope.outline.data[index].ind))
        {
            numElements = numElements + 1;
        }
        // number of children of next element,
        // skip over these when inserting
        var numSkip = 1;
        while (($scope.outline.data[index + numElements + numSkip]) &&
               ($scope.outline.data[index + numElements + numSkip].ind >
                $scope.outline.data[index].ind))
        {
            numSkip = numSkip + 1;
        }

        // prevent moving if element below group is of lower indent level
        if ($scope.outline.data[index+numElements] &&
            $scope.outline.data[index+numElements].ind <
            $scope.outline.data[index].ind) return;


        // perform move
        var temp = $scope.outline.data.splice(index, numElements);
        for (var i = 0; i < temp.length; i++) {
            $scope.outline.data.splice(index + numSkip + i, 0, temp[i]);
        }

        $scope.$apply();

        // refocus the element
        el.focus();
    }

    // delete a line given its input element
    $scope.deleteLine = function(el) {
        // only allow a delete if there's more than one line left!
        if ($scope.outline.data.length < 2)
            return;

        var index = $scope.getInputIndex(el);
        $scope.outline.data.remove(index);
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
