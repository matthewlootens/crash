var map;
const API_BASE_URL = 'http://localhost:5500/map';

/*
An attempt at the singelton pattern. We only want to have one layer, since they
add up on top of each other on the map.
*/
function Heatmap(heatmapOptions) {
    if (!Heatmap.heatmap) {
      this.heatmap = new google.maps.visualization.HeatmapLayer(heatmapOptions);
      Heatmap.heatmap = this.heatmap;
    }
    else {
      this.heatmap = Heatmap.heatmap.setOptions(heatmapOptions);
    }
}

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
  let cornerSW = map.getBounds().getSouthWest().toJSON();
  let cornerNE = map.getBounds().getNorthEast().toJSON();
  let queryString = `?lat1=${cornerSW.lat}&lng1=${cornerSW.lng}&lat2=${cornerNE.lat}&lng2=${cornerNE.lng}&zip=False`;
  let url = API_BASE_URL + queryString;
  let crashData = fetch(url);

  function makeLatLngList(data) {
    let latLngList = data.map(function(point, i) {
      return new google.maps.LatLng(point.latitude, point.longitude)
    });
    return latLngList;
  }

  crashData.then(response => response.json())
    .then(function(data) {
      let latLngList = makeLatLngList(data)
      let heatmapOptions =
        {
          data: latLngList,
          dissipating: true,
          map: map,
          radius: 30
        };
      let a = new Heatmap(heatmapOptions);
      console.log(a, typeof(a));

    });
}
