'use strict';

angular.module('hermesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/device/:id', {
        templateUrl: 'app/device/device.html',
        controller: 'DeviceCtrl'
      });
  });