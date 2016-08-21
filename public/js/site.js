var sliderConfig = {
  change: updateMap,
  min: 2007,
  max: 2016,
  value: 2016
};

function loadData (year) {
  $('#highlight-info').hide();
  var sliderHandle = $('.ui-slider-handle');
  var left = parseInt(sliderHandle.css('left').replace('px', ''));
  $('#slider-year').css({left: (left - 33) + 'px'});
  $('#slider-year').text(year);
  $.getJSON('/data_json/' + year + '_June.json', function (data) {
    $('#dropdown-list').html('');
    console.log(data);
    for(var i = 0; i < data.length; i++){
      var item = data[i];
      $('#dropdown-list')
        .append('<li onclick="changeDisease(' + i + ', \'' + item.name + '\')"><a>' + item.name + '</a></li>');
    }
  });
}

function changeDisease(index, name) {
  console.log(name);
  mapControl.setDiseaseIndex(index);
  $('#dropdown-button-text').text(name);
}

function updateMap (event, ui) {
  var year = ui.value;
  loadData(year);
  mapControl.setYear(year);
}

$('#slider').slider(sliderConfig);
loadData(2016);

document.onmousemove = function (e) {
  var x = e.clientX;
  var y = e.clientY;

  $('#highlight-info').css({
    left: x,
    top: y
  });
}
