'use strict';


angular.module('carouselDirectives', [])
  .directive('photoItem', function(){
    return {
      replace: true,
      transclude: true,
      scope:true,
      templateUrl: 'aui/carousel/template/photo-item.html'
    }
  })
  .directive('wrapperCarousel', function(){
    return {
      replace: true,
      scope:true,
      transclude: true,
      templateUrl: 'aui/carousel/template/wrapper-carousel.html',
      // The linking function will add behavior to the template
      link: function($scope, $element, attrs) {
      

        var slidder = $element.find("#slidder");

        $scope.rightClick = function(){
          $scope.indice = ($scope.indice + 1) % $scope.photos.length;
          slidder.animate({"margin-left" : "-=400px"}, 300,
            function(){
              slidder.children().first().appendTo(slidder);
              slidder.css({"margin-left" : "+=400px"});
              $scope.$apply(function(){
                $scope.photoTitle = $scope.photos[$scope.indice].title;
              });
            });
        }

        $scope.leftClick = function(){
          $scope.indice = ($scope.photos.length + $scope.indice - 1) % $scope.photos.length;
          slidder.children().last().prependTo(slidder);
          slidder.css({"margin-left" : "-=400px"});
          slidder.animate({"margin-left" : "+=400px"}, 300,
            function(){
              $scope.$apply(function(){
                $scope.photoTitle = $scope.photos[$scope.indice].title;
              });
            });
          
        } 
      }
    }
  })