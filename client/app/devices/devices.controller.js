'use strict';

angular.module('hermesApp')
    .controller('DevicesCtrl', function($scope, $http, $location, $timeout, Device, Loriini) {

        var STATUS_DAEMON_TIMESTAMP = 6000;

        var _server = ($location.$$absUrl.indexOf("localhost") >= 0) ? "localhost" : "hermes-nefele.rhcloud.com";

        $scope.Loriini = Loriini;
        $scope.newDevice = {};

        $scope.addDevice = function(p_newDevice) {

            p_newDevice = _generateClientIDAndSecret(p_newDevice);
            Device.save(p_newDevice);
            Loriini.devices = Device.query();

        }

        $scope.deleteDevice = function(p_device) {

            Device.delete({
                id: p_device._id
            });
            Loriini.devices = Device.query();

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

    });
