var sliderConfig = {
  change: updateMap
};

function updateMap (event, ui) {
  $('.ui-slider-handle').text(ui.value);
  var value = ui.value;
  console.log(value);
}

$('#slider').slider(sliderConfig);
