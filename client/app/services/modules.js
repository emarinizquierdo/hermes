'use strict';

angular.module('hermesApp')
  .factory('Module', function ($resource) {
    
    return $resource('/api/modules/:id');

  });
