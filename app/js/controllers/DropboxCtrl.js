ol.controller('DropboxCtrl', ['$scope', 'dropboxService',
                     function dropboxCtrl($scope,
                                          dropboxService) {
    'use strict';
    $scope.dropboxConnected = false;

    // try to connect with cached credentials on load
    dropboxService.connect($scope);

    $scope.$on('dropboxConnected', function() {
        $scope.dropboxConnected = true;
        $scope.$apply();
    });

    $scope.dropboxConnect = function() {
        dropboxService.auth($scope);
    };
}]);
