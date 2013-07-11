'use strict';

angular.module('menuService', [])
	.factory('MenuService', ['$http', function($http) {
		return {
	       getMenu: function(callback) {
	       	  
	          var _url = 'aui/menu/data/menu.json';
	          $http.get(_url).success(function(data) {
	          	callback(data);          
	          });
	       }
	   }
   	}]);