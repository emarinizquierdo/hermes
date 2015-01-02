'use strict';

angular.module('hermesApp')
  .factory('Module', function ($resource) {
    
    return $resource('/api/modules/:id', null, {
        'update': { method:'PUT' }
    });

  })
  .factory('Modules', function ($resource) {
    
    var _modules = {};


    _modules.availables = [

    	{
    		name : "Gauge",
    		nameValue : "gauge"
    	},
    	{
    		name : "Bar Charr",
    		nameValue : "basicPlotter"
    	},
    	{
    		name : "Line",
    		nameValue : "simpleLine"
    	}

    ];

    return _modules;

  });
