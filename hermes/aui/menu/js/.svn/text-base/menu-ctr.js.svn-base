'use strict';

angular.module('menuController', [ 'menuService' ])
.controller('MenuController', function($scope, $element, $location, MenuService, GlobalData){

	$scope.GlobalData = GlobalData;

	MenuService.getMenu(function(data) {
	    $scope.items = data;
	});

	$scope.path = $location.$$path;

	$scope.$on("navigate", function() {
		$scope.path = $location.$$path;
		$scope.isActive();
	});

	$scope.isActive  = function ( p_path ){

		if( p_path && $scope.path.indexOf(p_path.substr(1)) >= 0 ){
			return 'active';
		}else{
			return '';
		}
	}
   
   
});