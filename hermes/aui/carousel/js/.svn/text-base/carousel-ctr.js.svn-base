'use strict';

angular.module('carouselController', [ 'flickrService' ])
.controller('CarouselController', function($scope, $element, FlickrService){

	$scope.CallToFlickr = function( p_gallery_id ){

		if(!p_gallery_id){
			p_gallery_id = "72157632397355972";
		}

		FlickrService.getPhotos( p_gallery_id, function(data){        

			if(data.code == 1){
				$scope.warningNoConnection = data.message;
	        	$scope.warning = true;

			}else{

		        $scope.photos = data.photoset.photo;
		        $scope.indice = 0;
		        $scope.warning = false;
				$scope.loaded = true;

		        $scope.photoObjects = [];
		        for(var _i = 0; _i < $scope.photos.length; _i++){
		        	$scope.photoObjects[_i] = new Image();
		        	$scope.photoObjects[_i].src = "http://farm"+$scope.photos[_i].farm+".staticflickr.com/"+$scope.photos[_i].server+"/"+$scope.photos[_i].id+"_"+$scope.photos[_i].secret+"_z.jpg";
		        	$scope.photoObjects[_i].onload = onloadPhotos;
		        }

		        $scope.photoTitle = $scope.photos[0].title;
		        $scope.toLoad = $scope.photos.length;
		    }

		    function onloadPhotos(){
		        	--$scope.toLoad;
		        	if($scope.toLoad == 0){
		        		$scope.$apply(function(){
		        			$scope.loaded = false;
		        		});		
		        	}
		        }
	    });
	}

	$scope.CallToFlickr( '72157632397355972' );
    
   
});