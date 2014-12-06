'use strict';

angular.module('hermesApp')
  .controller('DevicesCtrl', function ($scope, $http, Device) {

    $scope.devices = [];
    $scope.newDevice = {};

    $scope.devices = Device.query();
    

    $scope.addDevice = function( p_newDevice ){

      Device.save(p_newDevice);
      $scope.devices = Device.query();

    }

    $scope.deleteDevice = function( p_device ){

      Device.delete(p_device);
      $scope.devices = Device.query();

    }

  });
