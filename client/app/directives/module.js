angular.module('hermesApp')
    .directive('module', ['$window', '$timeout', 'd3Service', 'Loriini', 'Gauge',

        function($window, $timeout, d3Service, Loriini, Gauge) {

            return {
                restrict: 'A',
                templateUrl: 'app/directives/module.html',
                scope: {
                    data: '=',
                    device: '=',
                    module: '=',
                    onClick: '&'
                },
                link: function(scope, ele, attrs) {

                    var config = {
                        size: ele.width() - 10,
                        label: "Temperatura",
                        min: 0,
                        max: 100,
                        minorTicks: 5
                    }

                    var range = config.max - config.min;
                    config.yellowZones = [{
                        from: config.min + range * 0.75,
                        to: config.min + range * 0.9
                    }];
                    config.redZones = [{
                        from: config.min + range * 0.9,
                        to: config.max
                    }];

                    var migauge;

                    d3Service.d3().then(function(d3) {

                        migauge = new Gauge(ele, config);
                        migauge.render();

                        var handler = function(p_data) {
                            migauge.redraw(p_data);
                        }

                        Loriini.attachHandler(scope.device, "/plotter/draw/", scope.module._id, handler);

                    });
                }
            }

        }

    ]);
