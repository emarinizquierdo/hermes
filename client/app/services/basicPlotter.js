angular.module('hermesApp')
    .factory('BasicPlotter', function($window, $timeout) {

        return function(p_ele, configuration) {

            var self = this; // for internal d3 functions

            var margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 30
                },
                labels,
                w = p_ele.find("#module-wrapper-d3").width() - margin.left - margin.right,
                h = p_ele.find("#module-wrapper-d3").height() - margin.top - margin.bottom,
                svg,
                xScale,
                yScale,
                color = d3.scale.category20()
                render = false;

            //Dummy data:
            //[{"label": "Greg", "value": 18},{"label": "Ari", "value": 96},{"label": "Q", "value": 15},{"label": "Loser", "value": 48}]

            var _init = function(){

                var fontSize = Math.round(w / 9);

                //Create SVG element
                svg = d3.select(p_ele.find("#module-wrapper-d3")[0])
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h);

                svg.append("svg:text")
                    .attr("x", w / 2 + margin.right)
                    .attr("y", "5" )
                    .attr("dy", fontSize / 2)
                    .attr("text-anchor", "middle")
                    .text("temperatura")
                    .style("font-size", "14px")
                    .style("fill", "#333")
                    .style("stroke-width", "2px");

                h -= 40;

            }

            var _initiateData = function( p_dataset ) {

                var dataset = p_dataset;
                
                //Create bars
                svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .transition()
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d) {
                        return h - yScale(d.value) + 30;
                    })
                    .attr("width", xScale.rangeBand())
                    .attr("height", function(d) {
                        return yScale(d.value);
                    })
                    .attr("fill", function(d) {
                        return color(d.value);
                    });

                //Create labels
                labels  = svg.selectAll("text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text(function(d) {
                        return d.label + " (" + d.value + ")";
                    })
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) {
                        return xScale(i) + xScale.rangeBand() / 2;
                    })
                    .attr("y", function(d) {
                        return h - yScale(d.value) + 30;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px");

                render = true;

            }

            this.render = function(p_dataset) {

                var dataset = p_dataset;


                xScale = d3.scale.ordinal()
                    .domain(d3.range(dataset.length))
                    .rangeRoundBands([0, w], 0.05);

                yScale = d3.scale.linear()
                    .domain([0, d3.max(dataset, function(d) {
                        return d.value;
                    })])
                    .range([0, h]);

                if (!render) {
                    _initiateData(dataset);
                } else {

                    //Update all rects
                    svg.selectAll("rect")
                        .data(dataset)
                        .transition() // <-- This makes it a smooth transition!
                        .attr("y", function(d) {
                            return h - yScale(d.value) + 30;
                        })
                        .attr("height", function(d) {
                            return yScale(d.value);
                        })
                        .attr("fill", function(d) {
                            return color(d.value);
                        });

                    //Update all labels
                    labels
                        .data(dataset)
                        .text(function(d) {
                            return d.label + " (" + d.value + ")";
                        })
                        .attr("x", function(d, i) {
                            return xScale(i) + xScale.rangeBand() / 2;
                        })
                        .attr("y", function(d) {
                            return h - yScale(d.value) + 30;
                        });
                }

            };

            this.handler = function(p_data) {
                var _data = JSON.parse(p_data);

                self.render(_data);

            };

            _init();

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
