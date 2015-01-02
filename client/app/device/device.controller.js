'use strict';

angular.module('hermesApp')
    .controller('DeviceCtrl', function($scope, $routeParams, $http, $location, $timeout, Loriini, Module, Modules) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        $scope.device = {};
        $scope.modules = [];
        $scope.availableModules = Modules.availables;

        function _init() {

            Loriini.getDevices().then(function(p_data) {
                for (var _i = 0; _i < p_data.length; _i++) {
                    if ($routeParams.id == p_data[_i]._id) {
                        $scope.device = p_data[_i];
                        $scope.device.handlers = {};
                    }
                }

                _getModules();

            });

        };

        var _getModules = function() {
            Module.query({}, function(p_data) {

                var _i;
                for (_i = 0; _i < p_data.length; _i++) {
                    p_data[_i].configuration = JSON.parse(p_data[_i].configuration);
                }
                $scope.modules = p_data;
            }, function(p_error) {});
        };

        $scope.addModule = function( p_name ) {

            var _moduleSeed = {
                moduleDirectiveName: p_name || "gauge",
                configuration: "{}"
            };

            Module.save(_moduleSeed, function(p_data) {
                _init();
            }, function(p_error) {});
        };

        $scope.updateModule = function(p_module) {

            p_module.configuration = JSON.stringify(p_module.configuration);

            Module.update( { id: p_module._id }, p_module,

            function(p_data) {
               _init();
            }, function(p_error) {});

        };

        $scope.deleteModule = function(p_module) {

            Module.delete({
                id: p_module._id
            }, function(p_data) {;
                _init();
            }, function(p_error) {});

        };

        $scope.dropCallback = function(event, ui, title, $index) {
            if ($scope.modules.map(function(item) {
                    return item.title;
                }).join('') === 'GOLLUM') {
                $scope.modules.forEach(function(value, key) {
                    $scope.modules[key].drag = false;
                });
            }
        };

        $scope.closeModal = function(p_module_name) {

            $('#add-module-modal').modal('hide');

            $timeout(function() {
                
                $scope.addModule( p_module_name);

            }, 300);
        }

        _init();

    });
