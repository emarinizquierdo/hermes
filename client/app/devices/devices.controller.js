'use strict';

angular.module('hermesApp')
    .controller('DevicesCtrl', function($scope, $http, $location, $timeout, Device) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermes-nefele.rhcloud.com";

        $scope.devices = [];
        $scope.newDevice = {};

        Device.query().$promise.then(function(p_data) {
            $scope.devices = p_data;
            for (var _i = 0; _i < $scope.devices.length; _i++) {
                _connectLoriiniListener($scope.devices[_i]);
            }
        });


        $scope.addDevice = function(p_newDevice) {

            p_newDevice = _generateClientIDAndSecret(p_newDevice);
            Device.save(p_newDevice);
            $scope.devices = Device.query();

        }

        $scope.deleteDevice = function(p_device) {

            Device.delete({
                id: p_device._id
            });
            $scope.devices = Device.query();

        }

        var _generateClientIDAndSecret = function(p_device) {
            p_device.clientID = p_device.clientID || createUUID();
            p_device.secret = createUUID();
            return p_device;
        }

        function createUUID() {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 17; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = "-";

            var uuid = s.join("");
            return uuid;
        }

        //Using the HiveMQ public Broker, with a random client Id
        var logActivity = function(message) {
            var logElem = document.getElementById('log');
            logElem.innerHTML = logElem.innerHTML + '<br/>' + message;
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
