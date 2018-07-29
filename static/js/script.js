/**
 * @file - Setup scripts for data visualization page
 * @author Matthew Lootens
 */

'use strict';
const API_BASE_URL = 'http://localhost:5500';

//Splash screen fade-away
// let button = document.getElementById("exit-intro");
//   button.addEventListener("click", function() {
//   this.parentNode.setAttribute("class", "fade-away");
//   this.parentNode.addEventListener("transitionend", function() {
//     this.setAttribute("class", "hidden")});
  // });

function exitIntro() {
  let promise = new Promise(function(resolve, reject) {
    let button = document.getElementById("exit-intro");
    button.addEventListener("click", function() {
      this.parentNode.setAttribute("class", "fade-away");
      // resolve(this);
      // reject("Failed to add event listener.");
    });
    resolve(button);
    reject("Failed to add event listener.");

  });
  return promise;
}

exitIntro().then((element) => element.parentNode.setAttribute("class", "hidden"))
  .catch((msg) => console.log(msg));

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

function populateYearDropdown() {
  if (this.readyState === XMLHttpRequest.DONE) {
    if (this.status === 200) {
      let response = JSON.parse(this.responseText);
      let selection = document.querySelector("#year-dropdown")
      for (let item of response) {
        let opt = document.createElement("option");
        opt.value = item.year;
        opt.text = item.year;
        selection.appendChild(opt);
      }
    }
  } else {
      window.alert('Connection failed or some other error (error' +
                    this.status + ')');
  }
}

function requestBoroData() {
  if (this.readyState === XMLHttpRequest.DONE) {
    if (this.status === 200) {
      let queryResult = JSON.parse(this.responseText); // or do you need JSON.parse here?
      makeDonutChart(queryResult);
    } else {
      window.alert('Connection failed.');
    }
  }
}

//
makeHTTPRequest(populateYearDropdown, '/years');

/*
Event handler for the dropdown menu
*/
let boroughDropdown = document.getElementById("borough-dropdown");
boroughDropdown.addEventListener("change", selectBorough);

function selectBorough() {
  let borough_selected = document.getElementById("borough-dropdown").value;
  let apiURL = '/api/filter_request?borough=' + borough_selected.toUpperCase();
  makeHTTPRequest(requestBoroData, apiURL);
  let queryResult = JSON.parse(query);
  createBarchart(queryResult);
  // makeDonutChart(queryResult);
};

/*
An old testing function.  Delete once you lern the syntax
*/
// function displayJSON(query) {
//   d3.json(API_URL + query, function(error, data) {
//
//     if(error) {
//       return console.warn(error);
//     }
//     d3.select('#query pre').html(query);
//     d3.select('#data pre').html(JSON.stringify(data, null, 4));
//   });
// };
