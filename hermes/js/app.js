'use strict';

// Declare app level module which depends on filters, and services
angular.module('hermes', ['Directives', 'Services', 'Controllers']).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/devices', {templateUrl: 'partials/devices.html', controller: OnNavigate });
    $routeProvider.when('/apps', {templateUrl: 'partials/apps.html', controller: OnNavigate });
    $routeProvider.when('/test', {templateUrl: 'partials/test.html', controller: OnNavigate });
    $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: OnNavigate });
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: OnNavigate });
    $routeProvider.when('/config', {templateUrl: 'partials/config.html', controller: OnNavigate });
    $routeProvider.otherwise({redirectTo: '/devices'});
  }]);

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + s4();
}

function getCookie(c_name){

	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
	  c_start = c_value.indexOf(c_name + "=");
	}
	
	if (c_start == -1){
	  c_value = null;
	}else{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}

	return c_value;
}