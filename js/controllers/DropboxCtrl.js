'use strict';

outlinear.controller('DropboxCtrl',
                     function dropboxCtrl($scope,
                                          dropboxService) {
    if (dropboxService.connect($scope));

    $scope.dropboxConnect = function() {
        dropboxService.auth();
        $scope.$emit('dropboxConnected')
    }
});

