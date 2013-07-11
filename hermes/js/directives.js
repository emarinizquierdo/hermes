'use strict';

/* Directives */

var INTEGER_REGEXP = /^\-?\d*$/;

angular.module('Directives', [])
.directive('integer', function( $filter ) {
	return {
	    require: 'ngModel',
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$parsers.unshift(function(viewValue) {      	
	        if (INTEGER_REGEXP.test(viewValue) || viewValue=="") {
	          // it is valid
	          ctrl.$setValidity('integer', true);
	          return viewValue;
	        } else {
	          // it is invalid, return undefined (no model update)
	          ctrl.$setValidity('integer', false);
	          return undefined;
	        }
	      });
	    }
	};

})
.directive('popupWindow', function() {
  return {
    templateUrl: 'partials/popup-window.html',
    controller: function($scope, $element, $attrs) {

      //Alert Data
      $scope.alert = {
          title : ""
        , message : ""
        , cancelButton : ""
        , showAccept : true
        , toDo : null
        , modalPopup : $(angular.element("#popupModal"))
      }

      $scope.$on("alert", function( p_event , p_data){
        $scope.alert.title = p_data.title || "Error"
        $scope.alert.cancelButton = "Aceptar"
        $scope.alert.showAccept = false;
        $scope.alert.message = p_data.message;
        $scope.alert.modalPopup.modal("show");
      });

      $scope.$on("modal", function( p_event, p_data ){
        $scope.alert.title = p_data.title || "Confirmación de datos"
        $scope.alert.message = p_data.message;
        $scope.alert.cancelButton = "Cancelar"
        $scope.alert.showAccept = true;
        $scope.alert.toDo = p_data.toDo;
        $scope.alert.modalPopup.modal("show");
      });


    }
  };
});