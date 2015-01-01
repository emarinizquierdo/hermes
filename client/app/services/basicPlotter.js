angular.module('hermesApp')
    .factory('BasicPlotter', function($window, $timeout) {

        return function(p_ele, configuration) {

            var renderTimeout;
            var margin = parseInt(configuration.margin) || 20,
                barHeight = parseInt(configuration.barHeight) || 20,
                barPadding = parseInt(configuration.barPadding) || 5;

            var svg = d3.select(p_ele.find("#module-wrapper-d3")[0])
                .append('svg')
                .style('width', '100%');

            $window.onresize = function() {
                scope.$apply();
            };

            this.render = function(data) {
                svg.selectAll('*').remove();

                if (!data) return;
                if (renderTimeout) clearTimeout(renderTimeout);

                renderTimeout = $timeout(function() {
                    var width = d3.select(p_ele[0])[0][0].offsetWidth - margin,
                        height = data.length * (barHeight + barPadding),
                        color = d3.scale.category20(),
                        xScale = d3.scale.linear()
                        .domain([0, d3.max(data, function(d) {
                            return d.score;
                        })])
                        .range([0, width]);

                    svg.attr('height', height);

                    svg.selectAll('rect')
                        .data(data)
                        .enter()
                        .append('rect')
                        .on('click', function(d, i) {
                            return this.onClick({
                                item: d
                            });
                        })
                        .attr('height', barHeight)
                        .attr('width', 140)
                        .attr('x', Math.round(margin / 2))
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding);
                        })
                        .attr('fill', function(d) {
                            return color(d.score);
                        })
                        .transition()
                        .duration(1000)
                        .attr('width', function(d) {
                            return xScale(d.score);
                        });
                    svg.selectAll('text')
                        .data(data)
                        .enter()
                        .append('text')
                        .attr('fill', '#fff')
                        .attr('y', function(d, i) {
                            return i * (barHeight + barPadding) + 15;
                        })
                        .attr('x', 15)
                        .text(function(d) {
                            return d.name + " (scored: " + d.score + ")";
                        });
                }, 200);

                

            }
            this.render([{name: "Greg", score: 98},{name: "Ari", score: 96},
                    {name: 'Q', score: 75},{name: "Loser", score: 48}]);
        }
    })
    .directive('basicPlotterConfig', [

        function() {

            return {
                restrict: 'A',
                templateUrl: 'app/directives/gaugeConfig.html',
                scope: {
                    gaugeConfig: '='
                },
                link: function(scope, element, attr) {

                },
                controller: function($scope, $element) {


                }
            }

        }

    ]);
