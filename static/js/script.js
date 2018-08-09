/**
 * @file - Setup scripts for data visualization page
 * @author Matthew Lootens
 */

'use strict';
const API_BASE_URL = 'http://localhost:5500';
/**
 * A generic function for doing simply AJAX requests using the
 * old style XMLHttpRequest() objects
 * @param {function} callbackFunction - Function to invoke at 'load' event.
 * @param {string} apiURL - E.g., '/' or '/years'
 * @returns {null}
 */
function makeHTTPRequest(callbackFunction, apiURL) {
  let httpRequest = new XMLHttpRequest();
  httpRequest.addEventListener("load", callbackFunction);
  httpRequest.open("GET", API_BASE_URL + apiURL);
  httpRequest.send();
}

function requestData() {
  if (this.readyState === XMLHttpRequest.DONE) {
    if (this.status === 200) {
      let queryResult = JSON.parse(this.responseText);
      // console.log(queryResult);
      d3.select("#chart-holder").selectAll("svg").remove();
      createStackedBarChart(queryResult);
    } else {
      window.alert('Connection failed');
    }
  }
}

function submitQuery() {
  let borough = document.getElementById("borough-dropdown")
    .value.toUpperCase();
  let year = document.getElementById("year-dropdown").value;
  let apiURL = `/crashes?borough=${borough}&year=${year=='allYears' ? '' : year}`;
  console.log(apiURL);
  makeHTTPRequest(requestData, apiURL);
}

function selectBorough() {
  let borough_selected = document.getElementById("borough-dropdown").value;
  let apiURL = '/crashes?borough=' + borough_selected.toUpperCase();
  makeHTTPRequest(requestBoroughData, apiURL);
}

function populateYearDropdown() {
  function addOption(value, text) {
    let opt = document.createElement("option");
    opt.value = value;
    opt.text = text;
    selection.appendChild(opt);
  }

  if (this.readyState === XMLHttpRequest.DONE) {
    if (this.status === 200) {
      let response = JSON.parse(this.responseText);
      var selection = document.querySelector("#year-dropdown");
      addOption('allYears', 'All Years');
      for (let item of response) {
        addOption(item.year, item.year);
      }
    }
  } else {
      window.alert('Connection failed or some other error (error' +
                    this.status + ')');
  }
}

(function initalizeScripts() {
  makeHTTPRequest(populateYearDropdown, '/years');
  document.getElementById("submit-button")
    .addEventListener('click', submitQuery);
})();
