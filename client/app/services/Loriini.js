'use strict';

angular.module('hermesApp')
    .factory('Loriini', function($rootScope, $location, $timeout, $q, Device) {

        var _Loriini = {};

        var STATUS_DAEMON_TIMESTAMP = 6000;

        var unsecureClient;
        $rootScope.loriniConnected = false;

        var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermesiot.ddns.net"; //"hermes-nefele.rhcloud.com";

        var _loriiniPromise = $q.defer();

        //Track to devices
        _Loriini.devices = [];

        var _statusDeviceDaemon = function(p_device) {

            unsecureClient.subscribe('/sloriini/status/' + p_device.clientID + '/' + p_device.secret);

            unsecureClient.on('message', function(topic, message) {
                if (topic == "/sloriini/status/" + p_device.clientID + '/' + p_device.secret) {
                    if (!$rootScope.$$phase) {
                        $rootScope.$apply();
                    }
                    console.log(unsecureClient.options.clientId);
                    var _currentTimestamp = new Date().getTime();
                    p_device.statusTimestamp = _currentTimestamp + STATUS_DAEMON_TIMESTAMP;
                    _statusDaemonChecker(p_device);
                }
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
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
                _currentTimestamp += STATUS_DAEMON_TIMESTAMP;
                p_device.statusDaemon = $timeout(function() {
                    _statusDaemonChecker(p_device);
                }, STATUS_DAEMON_TIMESTAMP);
            }

        };

        var _attachHandler = function( p_device, p_rest, p_handler){

            if($rootScope.loriniConnected){
                _privateAttachHandler();
            }else{
                $rootScope.$watch('loriniConnected', function(p_value){
                    if(p_value){
                        _privateAttachHandler();
                    }                    
                });
            }

            function _privateAttachHandler(){
                unsecureClient.subscribe(p_rest + p_device.clientID + '/' + p_device.secret);

                unsecureClient.on('message', function(topic, message) {
                    if (topic == p_rest + p_device.clientID + '/' + p_device.secret) {
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                        p_handler(message);
                        console.log( p_rest + " topic recived from " + p_device.clientID);
                        
                    }
                });
            }
        	

        };

        var _connect = function(p_callback) {

            unsecureClient = mows.createClient(8000, _server, {
                clientId: "loriini-" + new Date().getTime()
            });

            unsecureClient.on('connect', function() {

                console.log('Client connected.');

                for (var _i = 0; _i < _Loriini.devices.length; _i++) {
                    _statusDeviceDaemon(_Loriini.devices[_i]);
                }

                $rootScope.loriniConnected = true;

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

        var _asociateHandlers = function(p_loriini_client, p_device) {

            applyEventHandlers(p_device, p_loriini_client);

        };

        var _resolveGetDevice = function() {

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
