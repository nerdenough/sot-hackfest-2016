var sliderConfig = {
  change: updateMap
};

function updateMap (event, ui) {
  var value = ui.value;
  console.log(value);
}

$('#slider').slider(sliderConfig);
