angular.module('hermesApp')
    .directive('module', ['$window', '$timeout', '$compile', 'd3Service', 'Loriini', 'Gauge', 'BasicPlotter', 'Module',

        function($window, $timeout, $compile, d3Service, Loriini, Gauge, BasicPlotter, Module) {

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

                    d3Service.d3().then(function(d3) {

                        if(scope.module.moduleDirectiveName == "gauge"){
                            migauge = new Gauge(ele, config);
                            migauge.render();

                            var handler = function(p_data) {
                                migauge.redraw(p_data);
                            }
                        }else{
                            basicPlotter = new BasicPlotter(ele,config);
                        }
                        

                        $compile(ele.find(".module-modal-wrapper").attr("gauge-config", "module.configuration"))(scope);

                        Loriini.attachHandler(scope.device, "/plotter/draw/", scope.module._id, handler);

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

                }
            }

        }

    ]);
