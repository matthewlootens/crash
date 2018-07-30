"use strict";
var map;//This needs to be global so that the other functions can use it
const API_BASE_URL = 'http://localhost:5500/map';

// creates a new map instance
// and then add a 'click' event to load crashes
// within the current map display
(function initMap() {
  let mapHolder = document.getElementById("map-holder");
  let mapOptions = {
    center: new google.maps.LatLng(40.8651794,-73.8624126),
    zoom: 15
    };
  map = new google.maps.Map(mapHolder, mapOptions);
  google.maps.event.addListener(map, 'click', loadData);
}());

function loadData() {
  // map.data.loadGeoJson("/js/cityCouncil.json");
  let cornerSW = map.getBounds().getSouthWest().toJSON();
  let cornerNE = map.getBounds().getNorthEast().toJSON();
  let queryString = `?lat1=${cornerSW.lat}&lng1=${cornerSW.lng}&lat2=${cornerNE.lat}&lng2=${cornerNE.lng}&zip=False`;
  let url = API_BASE_URL + queryString;
  function drawMarkers(data) {
    for (let j = 0; j < data.length; j += 1) {
      let point = data[j];
      let latLng = new google.maps.LatLng(point.latitude, point.longitude);
      let infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(`<div class="info-window">${point.unique_key}</div>`);
      let marker = new google.maps.Marker({
        position:latLng,
        map: map})
      .addListener("click", function(event) { infoWindow.open(map, this); });
    }
  }
  let crashData = fetch(url);
  crashData.then(response => response.json())
  .then(data => drawMarkers(data));
}
