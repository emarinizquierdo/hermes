'use strict';

angular.module('hermesApp')
    .controller('DeviceCtrl', function($scope, $routeParams, $http, $location, $timeout, Device) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermes-nefele.rhcloud.com";

        $scope.device = {};

        Device.get({id : $routeParams.id}).$promise.then(function(p_data) {
            $scope.device = p_data;
            _connectLoriiniListener($scope.device);
        });

        $scope.deleteDevice = function(p_device) {

            Device.delete({
                id: p_device._id
            });
            $scope.devices = Device.query();

        }

        var applyEventHandlers = function(p_device, client, msg) {

            client.on('connect', function() {
                client.subscribe('/sloriini/status/' + p_device.clientID + '/' + p_device.secret);

                client.on('message', function(topic, message) {
                    if (topic == "/sloriini/status/" + p_device.clientID + '/' + p_device.secret) {
                      console.log(client.options.clientId);
                        var _currentTimestamp = new Date().getTime();
                        p_device.statusTimestamp = _currentTimestamp + STATUS_DAEMON_TIMESTAMP;
                        _statusDaemonChecker(p_device);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                });

            });

            client.on('error', function(e) {
                console.log('Client Error:', e);
            });


        };

        var _statusDaemonChecker = function(p_device) {

            var _currentTimestamp = new Date().getTime();

            if (p_device.statusDaemon) {
                $timeout.cancel(p_device.statusDaemon);
            }

            if (!p_device.statusTimestamp || p_device.statusTimestamp < _currentTimestamp) {
                p_device.status = {
                    on: false
                };
                p_device.statusDaemon = false;
            } else {
                p_device.status = {
                    on: true
                };
                _currentTimestamp += STATUS_DAEMON_TIMESTAMP;
                p_device.statusDaemon = $timeout(function() {
                    _statusDaemonChecker(p_device);
                }, STATUS_DAEMON_TIMESTAMP);
            }

        };

        var _connectLoriiniListener = function(p_device) {

            var _clientID = "loriini" + p_device.clientID;
            var unsecureClient = mows.createClient(8000, _server, {
                clientId: _clientID
            });

            applyEventHandlers(p_device, unsecureClient);

        };

    });
