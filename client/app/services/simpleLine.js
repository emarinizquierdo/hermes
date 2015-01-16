angular.module('hermesApp')
.factory('SimpleLine', function($window, $timeout) {

    return function(p_ele, configuration) {

        var n = 100,
            random = d3.random.normal(0, 0),
            data = d3.range(n).map(random);

        var margin = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 30
            },
            width = p_ele.find("#module-wrapper-d3").width() - margin.left - margin.right,
            height = p_ele.find("#module-wrapper-d3").height() - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .domain([1, n - 2])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([-100, 100])
            .range([height, 0]);

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d, i) {
                return x(i);
            })
            .y(function(d, i) {
                return y(d);
            });

        var svg = d3.select(p_ele.find("#module-wrapper-d3")[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("width", "100%");

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.svg.axis().scale(y).orient("left"));

        var path = svg.append("g")
            .attr("clip-path", "url(#clip)")
            .append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        this.redraw = function( p_value ) {

            // push a new data point onto the back
            data.push(p_value);

            // redraw the line, and slide it to the left
            path
                .attr("d", line)
                .attr("transform", null)
                .transition()
                .duration(300)
                .ease("linear")
                .attr("transform", "translate(" + x(0) + ",0)");

            // pop the old data point off the front
            data.shift();

        }
    }
})
.directive('simpleLineConfig', [

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
