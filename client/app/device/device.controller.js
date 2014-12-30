'use strict';

angular.module('hermesApp')
    .controller('DeviceCtrl', function($scope, $routeParams, $http, $location, $timeout, Loriini, Module) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        $scope.device = {};
        $scope.modules = [];

        function _init() {

            Loriini.getDevices().then(function(p_data) {
                for (var _i = 0; _i < p_data.length; _i++) {
                    if ($routeParams.id == p_data[_i]._id) {
                        $scope.device = p_data[_i];
                    }
                }

                _getModules();

            });

        };

        var _getModules = function(){
            Module.query({},function(p_data) {;
               $scope.modules = p_data;
            }, function(p_error) {});
        };

        $scope.addModule = function() {

            var _moduleSeed = {
                moduleDirectiveName: "gauge",
                configuration: "{}"
            };

            Module.save(_moduleSeed, function(p_data) {;
               _init();
            }, function(p_error) {});
        };

        $scope.deleteModule = function( p_module ) {

            Module.delete(p_module, function(p_data) {;
               _init();
            }, function(p_error) {});
        };

        $scope.dropCallback = function(event, ui, title, $index) {

        };

        _init();

    });
