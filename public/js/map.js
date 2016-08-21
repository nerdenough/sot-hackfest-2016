var map = L.map('map').setView(new L.LatLng(-41, 174), 5);

L.tileLayer('https://api.mapbox.com/styles/v1/hemolyticus/cis3tdb0q000bgrnn2fj8p0mo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVtb2x5dGljdXMiLCJhIjoiY2lzMmt5OHJ6MDE1eTJ6bGt3cTZuemR3aCJ9.AYvhTvGttKuosFQnoN3Ptw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
  	+ '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, '
    + 'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

function createMap(diseaseIndex, year) {
  var baseColorR = 255;
  var baseColorG = 255;
  var baseColorB = 255;

  $.getJSON('/data_json/' + year + '_June.json', function (diseaseJSON) {

    var maxCases = diseaseJSON[diseaseIndex].max;
    var dhbIDToNumCasesMap = diseaseJSON[diseaseIndex].values;

    $.getJSON("/map/NZDHB.json", function(data){ geojson = L.geoJson(data,{
      style: style,
      onEachFeature: onEachFeature} ).addTo(map);
    });

    /*********
    FUNCTIONS
    *********/

    function computeColor(dhbID) {
      var fraction = 1 - (dhbIDToNumCasesMap[dhbID-1] / maxCases);
      var r = Math.round(fraction * baseColorR);
      var g = Math.round(fraction * baseColorG);
      var b = Math.round(fraction * baseColorB);
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }


    //Style of map
      function style() {
          return {
              fillColor: '#000',
              weight: 1,
              opacity: 1,
              color: '#bdbdbd',
              dashArray: '3',
              fillOpacity: 0.7
          };
      }

    function setupStyle(feature, layer, isHighlighted) {
      if (isHighlighted) {
        layer.setStyle({
            weight: 2,
            color: 'rgb(254, 166, 6)',
            dashArray: '',
            fillOpacity: 1.0,
            fillColor:'rgb(254, 166, 6)'
        });
      } else {
        layer.setStyle({
          color: '#bdbdbd',
          fillColor: computeColor(feature.id),
          weight: 1,
          opacity: 1,
          dashArray: '3',
          fillOpacity: 0.7
        });
      }
    }

    //Style when mouse hovers
      function highlightFeature(e, feature) {
        /*TODO draw something*/
        console.log(feature.id);
        // $('#highlight-info').append("<p>" + dhbIDToNumCasesMap[feature.id] + "</p>");
        $('#info').html("<p>" + dhbIDToNumCasesMap[feature.id] + "</p>");
        $('#highlight-info').show();//css({"z-index": 999});
        setupStyle(feature, e.target, true);

        if (!L.Browser.ie && !L.Browser.opera) {
            e.target.bringToFront();
        }
    }
     //Reset styles when mouse out
    function resetHighlight(e, feature) {
      // $('#highlight-info').remove();
      $('#info').html("");
      $('#highlight-info').hide();//.css({"z-index": -1});
        setupStyle(feature, e.target, false);
    }

    function zoomToFeature(e) {
        map.fitBounds(e, e.target.getBounds());
    }


    function onEachFeature(feature, layer) {
        setupStyle(feature, layer, false);
        layer.on({
            mouseover: function(e) { highlightFeature(e, feature) },
            mouseout: function(e) { resetHighlight(e, feature) },
            click: zoomToFeature
        });
    }
  });
}

createMap(0, 2016);
