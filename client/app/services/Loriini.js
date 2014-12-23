'use strict';

angular.module('hermesApp')
  .factory('Loriini', function ($location) {
    
    var _Loriini = {};

    var STATUS_DAEMON_TIMESTAMP = 6000;

    var unsecureClient;
    var loriniConnected = false;
    var tailedAttachments = [];

    var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermes-nefele.rhcloud.com";

    var _attachHandler = function(p_device) {

    	if(!loriniConnected){

    		tailedAttachments[tailedAttachments.length] = _attachHandler;

    	}else{

    		unsecureClient.subscribe('/sloriini/status/' + p_device.clientID + '/' + p_device.secret);

	        unsecureClient.on('message', function(topic, message) {
	            if (topic == "/sloriini/status/" + p_device.clientID + '/' + p_device.secret) {
	                console.log(unsecureClient.options.clientId);
	                var _currentTimestamp = new Date().getTime();
	                p_device.statusTimestamp = _currentTimestamp + STATUS_DAEMON_TIMESTAMP;
	                _statusDaemonChecker(p_device);
	            }
	        });
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
            _currentTimestamp += STATUS_DAEMON_TIMESTAMP;
            p_device.statusDaemon = $timeout(function() {
                _statusDaemonChecker(p_device);
            }, STATUS_DAEMON_TIMESTAMP);
        }

    };

    var _initLoriini = function(p_callback) {

        var unsecureClient = mows.createClient(8000, _server, {
            clientId: "loriini-" + new Date().getTime()
        });

        unsecureClient.on('connect', function() {
            console.log('Client connected.');
            loriniConnected = true;
            for(var _i = 0; _i < tailedAttachments.length; _i++){
            	tailedAttachments[_i]();
            }

        });

        unsecureClient.on('error', function(e) {
            console.log('Client Error:', e);
        });

    };

    var _asociateHandlers = function(p_loriini_client, p_device) {

        applyEventHandlers(p_device, p_loriini_client);

    };

	_initLoriini();

	_Loriini.attachHandler = _attachHandler;

	return _Loriini;

  });