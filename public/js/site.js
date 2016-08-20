var sliderConfig = {
  change: updateMap
};

function loadData () {
  $.getJSON('/data_json/2016_June.json', function (data) {
    console.log(data);
  });
}

function updateMap (event, ui) {
  var value = ui.value;
  console.log(value);
}

$('#slider').slider(sliderConfig);
loadData();
