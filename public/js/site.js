var sliderConfig = {
  change: updateMap,
  min: 2002,
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
        .append('<li onclick="changeDisease(' + i + ')"><a>' + item.name + '</a></li>');
    }
  });

}

function changeDisease(index) {
  console.log(index);
  mapControl.setDiseaseIndex(index);
}

function updateMap (event, ui) {
  var year = ui.value;
  loadData(year);
  mapControl.setYear(year);
}

$('#slider').slider(sliderConfig);
loadData(2016);
