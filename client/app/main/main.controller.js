'use strict';

angular.module('hermesApp')
    .controller('MainCtrl', function($scope, $http, $location) {
        //Using the HiveMQ public Broker, with a random client Id
        var logActivity = function(message) {
            var logElem = document.getElementById('log');
            logElem.innerHTML = logElem.innerHTML + '<br/>' + message;
        }

        var applyEventHandlers = function(client, msg) {
            client.on('connect', function() {
                logActivity('Client connected as ' + client.options.clientId);
                client.subscribe('/hiworld');
                client.publish('/hiworld', msg);
            });

            client.on('error', function(e) {
                logActivity('Client Error ' + e);
                console.log('Client Error:', e);
            });

            client.on('message', function(topic, message) {
                logActivity('Client received message: ' + message);
                client.end();
            });
        };

        /**
         * Example #1 - connect to an unsecure MOWS server
         */
        /*
        var _server = ( $location.$$absUrl.indexOf("localhost") >=0 ) ? "localhost" : "hermes-nefele.rhcloud.com";

        var unsecureClient = mows.createClient( 8000, _server );

        applyEventHandlers(unsecureClient, 'Hello, I am a unsecure client');
*/

    });
