var map = L.map('map').setView(new L.LatLng(-41, 174), 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
  	+ '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
    + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

$.getJSON("/map/NZDHB.json", function(data){ geojson = L.geoJson(data,{
                style: style,
                onEachFeature: onEachFeature} ).addTo(map);
      });

		 


/*********
FUNCTIONS
*********/

  
//Style of map
  function style() {
      return {
         
          fillColor: '#fff',
          weight: 1,
          opacity: 1,
          color: '#bdbdbd',
          dashArray: '3',
          fillOpacity: 0.7
      };
  }

//Style when mouse hovers
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#fea606',
        dashArray: '',
        fillOpacity: 1.0,
        fillColor:'#fea606'
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}
 //Reset styles when mouse out
function resetHighlight(e) {

    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


    
	