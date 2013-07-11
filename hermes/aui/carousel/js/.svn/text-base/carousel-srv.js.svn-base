'use strict';

angular.module('flickrService', [])
	.factory('FlickrService', ['$http', function($http) {
		return {
	       getPhotos: function( p_gallery_id, callback) {
	       	  
	          var _url = 'http://api.flickr.com/services/rest/';
	          $http({
	          	  method: "JSONP"
	          	, url : _url
	          	, params : {
	          		  method : 'flickr.photosets.getPhotos'
	          		, api_key : 'e850e1c8412832b9657662b9d3fa77bf'
	          		, photoset_id : p_gallery_id
	          		, format : 'json'
	          		, jsoncallback : 'JSON_CALLBACK'
	          	  }
	          }).success(function(data) {
	          	callback(data);          
	          });
	       }
	   }
   	}]);