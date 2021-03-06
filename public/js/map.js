var DHB_NAMES = [
  "Northland",
  "Waitemata",
  "Auckland",
  "Counties Manukau",
  "Waikato",
  "Lakes",
  "Bay of Plenty",
  "Tairawhiti",
  "Taranaki",
  "Hawke's Bay",
  "Whanganui",
  "MidCentral",
  "Hutt Valley",
  "Capital and Coast",
  "Wairarapa",
  "Nelson Marlborough",
  "West Coast",
  "Canterbury",
  "South Canterbury",
  "Southern"
];

var DISEASE_COLORS = [
  [0xff, 0xf1, 0x00]
];

mapControl = function() {
  var map = L.map('map').setView(new L.LatLng(-41, 174), 5);

  var currYear = 2016;
  var currDiseaseIndex = 0;

  var maxCases = 110;
  var dhbIDToNumCasesMap = null;

  var featuresAndLayers = [];

  var baseColorR = 255;
  var baseColorG = 255;
  var baseColorB = 255;

  function updateColors() {
    if (currDiseaseIndex < DISEASE_COLORS.length) {
      baseColorR = DISEASE_COLORS[currDiseaseIndex][0];
      baseColorG = DISEASE_COLORS[currDiseaseIndex][1];
      baseColorB = DISEASE_COLORS[currDiseaseIndex][2];
    } else {
      baseColorR = 255;
      baseColorG = 255;
      baseColorB = 255;
    }
  }
  updateColors();

  function loadDataJSON(onFinish) {
    $.getJSON('/data_json/' + currYear + '_June.json', function (diseaseJSON) {
      dhbIDToNumCasesMap = diseaseJSON[currDiseaseIndex].values;
      onFinish();
    });
  }

  loadDataJSON(createMap);

  L.tileLayer('https://api.mapbox.com/styles/v1/hemolyticus/cis3tdb0q000bgrnn2fj8p0mo/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaGVtb2x5dGljdXMiLCJhIjoiY2lzMmt5OHJ6MDE1eTJ6bGt3cTZuemR3aCJ9.AYvhTvGttKuosFQnoN3Ptw', {
    maxZoom: 18,
    attribution: ''
  }).addTo(map);


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
          fillOpacity: 1
        });
      }
    }

    //Style when mouse hovers
    function highlightFeature(e, feature) {
      setupStyle(feature, e.target, true);
      console.log(feature.id);

      $('#highlight-info').show();
      $('#info').html("<p>" + DHB_NAMES[feature.id-1] + ": " + dhbIDToNumCasesMap[feature.id-1] + "</p>");

      if (!L.Browser.ie && !L.Browser.opera) {
          e.target.bringToFront();
      }
    }

     //Reset styles when mouse out
    function resetHighlight(e, feature) {
      $('#info').html("");
      $('#highlight-info').hide();
      setupStyle(feature, e.target, false);
    }

    function zoomToFeature(e) {
      map.fitBounds(e, e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
      featuresAndLayers.push([feature, layer]);
      setupStyle(feature, layer, false);
      layer.on({
          mouseover: function(e) { highlightFeature(e, feature) },
          mouseout: function(e) { resetHighlight(e, feature) },
          click: zoomToFeature
      });
    }

  function createMap() {
    $.getJSON("/map/NZDHB.json", function(data){ geojson = L.geoJson(data,{
      style: style,
      onEachFeature: onEachFeature} ).addTo(map);
    });
  }

  function updateMap() {
    for (var i = 0; i < featuresAndLayers.length; ++i) {
      var feature = featuresAndLayers[i][0];
      var layer = featuresAndLayers[i][1];
      setupStyle(feature, layer, false);
    }
  }

  return {
    createMap : createMap,
    setDiseaseIndex : function(index) {
      currDiseaseIndex = index;
      updateColors();
      loadDataJSON(updateMap);
    },
    setYear : function(y) {
      currYear = y;
      loadDataJSON(updateMap);
    }
  };
}();
