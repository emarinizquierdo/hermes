'use strict';

angular.module('hermesApp')
  .factory('Device', function ($resource) {
    
    return $resource('/api/devices/:id');

  });
