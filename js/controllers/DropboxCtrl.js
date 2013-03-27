'use strict';

outlinear.controller('DropboxCtrl',
                     function dropboxCtrl($scope,
                                          dropboxService) {
    $scope.dropboxConnect = function() {
        dropboxService.connect();
    }
});

