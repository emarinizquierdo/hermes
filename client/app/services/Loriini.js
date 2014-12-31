'use strict';

angular.module('hermesApp')
    .factory('Loriini', function($rootScope, $location, $timeout, $q, Device) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        var _Loriini = {
            devices: []
        };

        var unsecureClient;
        var _loriiniPromise = $q.defer();
        var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermesiot.ddns.net"; //"hermes-nefele.rhcloud.com";


        $rootScope.loriniConnected = false;

        var _initDeviceHandlers = function(p_device) {

            unsecureClient.subscribe('/sloriini/status/' + p_device.clientID + '/' + p_device.secret);

            p_device.handlers['/sloriini/status/' + p_device.clientID + '/' + p_device.secret] = _statusDaemon;

            unsecureClient.on('message', function(topic, message) {

                if (p_device.handlers[topic]) {

                    var key;

                    if (typeof p_device.handlers[topic] == "function") {
                        p_device.handlers[topic](message);
                    } else {

                        for (key in p_device.handlers[topic]) {

                            if (p_device.handlers[topic].hasOwnProperty(key)) {
                                p_device.handlers[topic][key](message);
                            }

                        }

                    }

                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }

                    console.log(topic + " topic recived from " + p_device.clientID);

                }

            });

            function _statusDaemon() {
                console.log(unsecureClient.options.clientId);
                var _currentTimestamp = new Date().getTime();
                p_device.statusTimestamp = _currentTimestamp + STATUS_DAEMON_TIMESTAMP;
                _statusDaemonChecker(p_device);
            }

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
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                _currentTimestamp += STATUS_DAEMON_TIMESTAMP;
                p_device.statusDaemon = $timeout(function() {
                    _statusDaemonChecker(p_device);
                }, STATUS_DAEMON_TIMESTAMP);
            }

        };

        var _attachHandler = function(p_device, p_rest, p_id, p_handler) {

            if ($rootScope.loriniConnected) {
                _privateAttachHandler();
            } else {
                $rootScope.$watch('loriniConnected', function(p_value) {
                    if (p_value) {
                        _privateAttachHandler();
                    }
                });
            }

            function _privateAttachHandler() {
                unsecureClient.subscribe(p_rest + p_device.clientID + '/' + p_device.secret);
                if (!p_device.handlers[p_rest + p_device.clientID + '/' + p_device.secret]) {
                    p_device.handlers[p_rest + p_device.clientID + '/' + p_device.secret] = {};
                }
                p_device.handlers[p_rest + p_device.clientID + '/' + p_device.secret][p_id] = p_handler;
            }


        };

        var _connect = function(p_callback) {

            unsecureClient = mows.createClient(8000, _server, {
                clientId: "loriini-" + new Date().getTime()
            });

            unsecureClient.on('connect', function() {

                console.log('Client connected.');

                for (var _i = 0; _i < _Loriini.devices.length; _i++) {
                    _initDeviceHandlers(_Loriini.devices[_i]);
                }

                $rootScope.loriniConnected = true;

                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }

            });

            unsecureClient.on('error', function(e) {
                console.log('Client Error:', e);
            });

        };

        var _initLoriini = function() {
            Device.query().$promise.then(function(p_data) {
                _Loriini.devices = p_data;
                _loriiniPromise.resolve(_Loriini.devices);
                _Loriini.connect();
            });
        }

        var _getDevices = function(p_id) {

            if ($rootScope.loriniConnected) {

                _loriiniPromise.resolve(_Loriini.devices);

            }

            return _loriiniPromise.promise;

        }

        _initLoriini();

        _Loriini.attachHandler = _attachHandler;
        _Loriini.getDevices = _getDevices;
        _Loriini.connect = _connect;

        return _Loriini;

    });
