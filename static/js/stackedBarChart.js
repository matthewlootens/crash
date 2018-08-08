"use strict";

function createStackedBarChart(jsonList) {
  let svg = d3.select("#chart-holder").append("svg");
  // svg.append("svg");
  // constants for use in creating a bar chart
  let data = jsonList,
      width = 1000,
      height = 900;
      // margin = {top: 20, right: 20, bottom: 50, left: 40},
      // width =  800 - margin.left - margin.right,//+svg.attr("width")
      // height = 700 - margin.top - margin.bottom;//+svg.attr("height")
  // let svg = d3.select("#chart-holder").append("svg").attr("width", width)
  //     .attr("height", height);

  let g = svg.append("g");
  let keys = [
    "sum_number_of_persons_injured",
    "sum_number_of_motorist_killed",
    "sum_number_of_pedestrians_injured",
    "sum_number_of_cyclist_killed",
    "sum_number_of_persons_killed",
    "sum_number_of_cyclist_injured",
    "sum_number_of_motorist_injured",
    "sum_number_of_pedestrians_killed"
  ];

  let colors = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"];

  // helper function for getting total number of crashes in the object "crash_totals"
  function getTotalNumber(d) {
    let x = 0;
    for (let key in d.crash_totals) {
      if (d.crash_totals.hasOwnProperty(key)) {
        x += d.crash_totals[key];
      }
    }
    return x;
  }

  // define generators used to create the svg elements
  // that comprise the stacked bar chart
  // define the axes: x, y, and z (the colors of the stacked data)
  let x = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.05)
      .align(0.1);

  let y = d3.scaleLinear()
      .range([height, 0]);

  let z = d3.scaleOrdinal()
      .range(colors);

  // define the domain of the axes
  x.domain(data.map(function(d) { return d.zip_code; }));
  y.domain([0, d3.max(data, getTotalNumber)]).nice();
  z.domain(keys);

  //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  // a stack generator
  let stack = d3.stack()
              .keys(keys)
              .value(function(d, key) { return d.crash_totals[key]; });

  let area = d3.area();

  // each "stacked bar" of each belongs to a <g> element
  g.append("g").attr("class", "stacked-bars")
    // .attr("trasform", "translate(30, 0)")
    .selectAll("g")
      .data(stack(data))
      .enter().append("g")
        //this returns the key for which this data is used for???
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
      .call(d3.axisBottom(x)
                      .tickSizeOuter(0))
      .selectAll("text")
      //.attr("transform", "rotate(-90)")
      .attr("text-anchor", "end")
      .attr("y", "40px")
      .attr("writing-mode", "vertical-rl")
      .attr("x", "0px");

  // y-axis
  g.append("g")
      .attr("class", "y axis")
      // .attr("transform", "translate(30, 0)")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "-0.72em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("text", "Crashes");

  // create the legend text and color boxes
  let legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10")
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 45)
      .attr("y", 10)
      .attr("dy", "0.32em")
      .text(function(d) { return d.replace(/_/g, ' ').replace(/sum /, '') });
}
