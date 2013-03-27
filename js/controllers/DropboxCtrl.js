'use strict';

outlinear.controller('DropboxCtrl',
                     function dropboxCtrl($scope,
                                          dropboxService) {
    dropboxService.connect();
    $scope.dropboxConnect = function() {
        dropboxService.auth();
    }
});

