'use strict';

angular.module('hermesApp')
    .controller('DeviceCtrl', function($scope, $routeParams, $http, $location, $timeout, Loriini) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        $scope.device = {};
        
        Loriini.getDevices().then(function(p_data){
            for (var _i = 0; _i < p_data.length; _i++) {
                if ( $routeParams.id == p_data[_i]._id) {
                    $scope.device = p_data[_i];
                }
            }
        });



    });
