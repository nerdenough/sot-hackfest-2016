var sliderConfig = {
  change: updateMap,
  min: 2011,
  max: 2016,
  value: 2016
};

function loadData (year) {
  $.getJSON('/data_json/' + year + '_June.json', function (data) {
    console.log(data);
  });
}

function updateMap (event, ui) {
  loadData(ui.value);
}

$('#slider').slider(sliderConfig);
loadData(2016);
