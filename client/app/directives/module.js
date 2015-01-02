angular.module('hermesApp')
    .directive('module', ['$window', '$timeout', '$compile', 'd3Service', 'Loriini', 'Gauge', 'BasicPlotter', 'SimpleLine', 'Module',

        function($window, $timeout, $compile, d3Service, Loriini, Gauge, BasicPlotter, SimpleLine, Module) {

            return {
                restrict: 'A',
                templateUrl: 'app/directives/module.html',
                scope: {
                    data: '=',
                    device: '=',
                    module: '=',
                    delete: '=',
                    update: '=',
                    onClick: '&'
                },
                link: function(scope, ele, attrs) {

                    var config = {
                        size: ele.width() - 10,
                        label: scope.module.configuration.title || "Temperatura",
                        min: parseInt(scope.module.configuration.minLimit) || 0,
                        max: parseInt(scope.module.configuration.maxLimit) || 1000,
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
                    var basicPlotter; 
                    var simpleLine;

                    d3Service.d3().then(function(d3) {

                        if(scope.module.moduleDirectiveName == "gauge"){

                            migauge = new Gauge(ele, config);

                            _attachLorini("/plotter/draw/", migauge.handler);

                        }else if(scope.module.moduleDirectiveName == "basicPlotter"){

                            basicPlotter = new BasicPlotter(ele,config);

                            _attachLorini("/chart/draw/", basicPlotter.handler);

                        }else{

                            simpleLine = new SimpleLine(ele,config);

                            handler = function(p_data) {
                                simpleLine.redraw(p_data);
                            }

                            _attachLorini("/simpleLine/draw/", handler);

                        }

                        $compile(ele.find(".module-modal-wrapper").attr("gauge-config", "module.configuration"))(scope);

                    });

                    scope.showModal = function() {

                        ele.find('#module-modal').modal('show');

                    }

                    scope.closeModal = function(p_module) {

                        ele.find('#module-modal').modal('hide');

                        $timeout(function() {
                            scope.update(p_module);
                        }, 300);
                    }

                    var _attachLorini = function( p_rest, p_handler){
                        Loriini.attachHandler(scope.device, p_rest, scope.module._id, p_handler);
                    }

                }
            }

        }

    ]);
