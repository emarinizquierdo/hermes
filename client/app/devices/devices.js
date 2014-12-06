'use strict';

angular.module('hermesApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/devices', {
        templateUrl: 'app/devices/devices.html',
        controller: 'DevicesCtrl'
      });
  });