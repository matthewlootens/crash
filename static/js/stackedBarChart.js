"use strict";

let svg = d3.select("svg");

// get the data
// testData is imported in another file
let data = testData,
    // width = 800,
    // height = 600,
    margin = {top: 20, right: 20, bottom: 50, left: 40},
    width =  800 - margin.left - margin.right,//+svg.attr("width")
    height = 700 - margin.top - margin.bottom;//+svg.attr("height")
// let svg = d3.select("#chart-holder").append("svg").attr("width", width)
//     .attr("height", height);

let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// constants for use in creating a bar chart
let BOROUGH = ["BRONX"]
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
//define basic axes
let x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);

let z = d3.scaleOrdinal()// for colors of the various stacked data
    .range(colors);

//.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
// function for getting total number of crashes in the object "crash_totals"
function getTotalNumber(d) {
  let x = 0;
  for (let key in d.crash_totals) {
    if (d.crash_totals.hasOwnProperty(key)) {
      x += d.crash_totals[key];
    }
  }
  return x;
}

// define the domain of the axes
x.domain(data.map(function(d) { return d.zip_code; }));
y.domain([0, d3.max(data, getTotalNumber)]).nice();
z.domain(keys);


//define generators used to create the svg elements
// that comprise the stacked bar chart
let stack = d3.stack()
            .keys(keys)
            .value(function(d, key) { return d.crash_totals[key]; });

let area = d3.area();

//Basically one has one containing "g" element for the entire chart.
//All the stacked bars have a container.
g.append("g").attr("class", "stacked-bars").selectAll("g")
    .data(stack(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })//this returns the key for which this data is used for???
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.zip_code); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })//be careful to pass both vals to y(), not their difference
      .attr("width", x.bandwidth());

//Add a "g" element for the x-axis
g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (height) + ")")
    .call(d3.axisBottom(x)
		    .tickSizeOuter(0))
    .selectAll("text")
    //.attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .attr("y", "-5px")
    .attr("writing-mode", "vertical-rl")
    .attr("x", "-8px");

// y-axis
g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null, "s"))
  .append("text")
    .attr("x", 2)
    .attr("y", y(y.ticks().pop()) + 0.5)
    .attr("dy", "0.32em")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .attr("text", "Crashes");

// create the legend
let legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10")
    .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys.slice().reverse())//slice returns a shallow copy, and reverse works in-place
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0, " + i * 20 + ")"; }); 

legend.append("rect")
    .attr("x", width - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) { return d; });
