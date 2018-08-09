"use strict";
// data is a list of JSONs

function createStackedBarChart(data) {
  let chartHolder = d3.select("#chart-holder"),
    svg = chartHolder.append("svg"),
    margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = parseInt(chartHolder.style("width"), 10) - margin.right - margin.left,
    height = parseInt(chartHolder.style("height"), 10) - margin.top - margin.bottom;

  let g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  let keys = Object.keys(data[0]["crash_totals"]);

  let colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"];

  // helper function for getting total number of crashes
  // for calculating total height of each bar
  function getTotalNumber(d) {
    let x = 0;
    for (let key in d.crash_totals) {
      if (d.crash_totals.hasOwnProperty(key)) {
        x += d.crash_totals[key];
      }
    }
    return x;
  }

  // define generators used to create axes and colored rects of chart
  //
  // define the axes: x, y, and z (the colors of the stacked data)
  let x = d3.scaleBand()
      .domain(data.map(function(d) { return d.zip_code; }))
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  let y = d3.scaleLinear()
      .domain([0, d3.max(data, getTotalNumber)]).nice()
      .range([height, 0]);

  let z = d3.scaleOrdinal()
      .domain(keys)
      .range(colors.slice(0, keys.length));

  // a stack generator to make the individual stacks
  let stack = d3.stack()
              .keys(keys)
              .value(function(d, key) { return d.crash_totals[key]; });

  // each "stacked bar" of each belongs to a <g> element
  g.append("g").attr("class", "stacked-bars")
    .selectAll("g")
      .data(stack(data))
      .enter().append("g")
        .attr("fill", function(d) { return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.zip_code); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

  // add a <g> element for the x-axis
  // and configure the display of the axis
  g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + (height) + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
        .attr("text-anchor", "start")
        .attr("y", "5px")
        .attr("writing-mode", "vertical-rl")
        .attr("x", "-1px");

  // y-axis
  g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "-0.72em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "end");

  // create the legend text and color boxes
  let legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) {
        return "translate(0, " + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 45)
      .attr("y", 10)
      .attr("dy", "0.32em")
      .text(function(d) { return d.replace(/_/g, ' ')
                                    .replace(/sum /, '') });
}
