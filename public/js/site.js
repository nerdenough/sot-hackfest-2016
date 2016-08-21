var sliderConfig = {
  change: updateMap,
  min: 2002,
  max: 2016,
  value: 2016
};

function loadData (year) {
  var sliderHandle = $('.ui-slider-handle');
  var left = parseInt(sliderHandle.css('left').replace('px', ''));
  var paddingLeft = parseInt(sliderHandle.css('padding-left').replace('px', ''));
  $('#slider-year').css({left: left + paddingLeft + 'px'});
  $('#slider-year').text(year);
  $.getJSON('/data_json/' + year + '_June.json', function (data) {
    $('#dropdown-list').html('');
    console.log(data);
    for(var i = 0; i < data.length; i++){
      var item = data[i];
      $("#dropdown-list").append("<li onclick='updateMap("+i+")'><a>" + item.name +"</a></li>");
    }
  });

}

function updateMap (event, ui) {
  loadData(ui.value);
}

$('#slider').slider(sliderConfig);
loadData(2016);
