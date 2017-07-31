$(document).ready(function() {
  var userLat = [];
  var userLon = [];
  var address = "";

  function geoFindMe() {

    function success(position) {

      userLat = position.coords.latitude;
      userLon = position.coords.longitude;

      getAddress();
      getWeather();
    };

    function error() {
      $('#summary').html("<p>Unable to retreive your location</p>"); // writes error to summary div
    }

    $('#summary').html("<p>Locating...</p>"); // writes to summary div to get replaced in getWeather function
    navigator.geolocation.getCurrentPosition(success, error);
  }; // end geoFindMe

  function getAddress() {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + userLat
    url += "," + userLon + "&key=AIzaSyDbULMOB7-YnmllUDpv-9ZOnZBQg2-yGwY";

    $.getJSON(url, function(response) {
      address = response.results[7].formatted_address;

      // getWeather();
    });
  };

  function getWeather() {
    var url = "https://api.darksky.net/forecast/2ffb0a3cf14aafa85635e93794a2db71/";
    url += userLat + "," + userLon + "?callback=?";

    $.getJSON(url, function(response) {
      var temp = Math.round(response.currently.temperature);
      var icon = response.currently.icon;
      var summary = response.currently.summary;
      var skycons = new Skycons({
        "color": "white"
      });

      // console.log(response);
      // console.log(temp, icon, summary, address);

      // $('#icon-output').html('<canvas id="icon1" width="128" height="128"></canvas>');
      $('#icon-output').html('<canvas id="icon1" width="500" height="500"></canvas>');
      $('#temp').html("<p>" + temp + "</p>");
      $('#units').html("<a href='#' id='fahrenheit'>&deg;F</a><a href='#' id='celsius' style='display: none'>&deg;C</a>");
      $('#summary').html("<p>" + summary + "</p>");
      $('#address').html("<p>" + address + "</p>");

      skycons.add("icon1", icon);
      skycons.play();

      function toggleUnits() {
        $('#units a').click(function(event) {
          var x = temp;
          event.preventDefault();
          $('#units a').toggle();
          if ($('#fahrenheit').css('display') === "none") {
            x = Math.round((temp - 32) * (5 / 9));
            $('#temp').html("<p>" + x + "</p>");
          } else {
            $('#temp').html("<p>" + temp + "</p>");
          }; // end if/else
        }); // end click
      }; // end toggleUnits
      
      toggleUnits();

    }); // end getJSON
  }; // end getWeather

  geoFindMe();

}); // end ready