var map = null;
var hotels = [];
var markers = [];

// Init map
function initMap() {
  var adl = {lat: -34.9284989, lng: 138.6007456};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: adl
  });
}

// Load and show hotels on map
function showHotels() {
  // Create new AJAX request
  var xhttp = new XMLHttpRequest();

  // Define behaviour for a response
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // convert from string to JSON, populate hotels array
      console.log(xhttp.responseText);
      hotels = JSON.parse(xhttp.responseText);

      // Clear map
      clearMarkers();

      // Populate map
      addMarkers();
    }
  };

  // Initiate connection
  xhttp.open("GET", "hotel.json", true);

  // Send request
  xhttp.send();
}

// Remove markers from map by setting their map to null
function clearMarkers() {
   for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// Populate map with markers from hotels array info
function addMarkers() {
  // Loop over hotels array
  for (let i = 0; i < hotels.length; i++) {
    // Create new marker
    var marker = new google.maps.Marker({
      position: {lat: hotels[i].lat, lng: hotels[i].lng},
      label: hotels[i].name,
      map: map
    });

    //Infowindow made here
    infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent(

            '<div style="position:relative">'+
            '<img src="'+
            "http://lorempixel.com/400/400/city/" +(i+1)+
            '" alt="hotel" title="Your Hotel" style="height:250px;margin:auto;display:block">'+
            '<div style="position:absolute;bottom:8px;left:16px;font-size:24px;font-weight:300;text-shadow:rgb(0,0,0)2px 2px 2px;color:rgb(255,255,255)">'+hotels[i].name+'</div>'+
            '</div>'+

            '<div style="display:block;margin:auto;padding:5px">'+
            '<img alt="wifi" src="images/wifi.png" />'+
            '<span style="margin-left:10px;margin-right:10px">Yes</span>'+
            '<img alt="wifi" src="images/coffee.png" />'+
            '<span style="margin-left:10px;margin-right:10px">Yes</span>'+
            '<img alt="wifi" src="images/car.png" />'+
            '<span style="margin-left:10px;margin-right:10px">Yes</span>'+
            '<img alt="wifi" src="images/shower.png" />'+
            '<span style="margin-left:10px;margin-right:10px">Yes</span>'+
            '</div>'+

            '<div width="100px" style="padding:0px;margin:5px;float:left">'+
            '<p style="padding:0px;margin:0px">'+"DESCRIPTION HERE"+'</p>'+ //description here
            '</div>'

          );
          infowindow.open(map, this);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
    });

    // Add to markers array
    markers.push(marker);
  }
}

// Send data to json file
function sendData() {
  var new_hotel = {name:"hotel4",lat:23,lng:25};
  // Create new AJAX request
  var xhttp = new XMLHttpRequest();

  // Define behaviour for a response
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };

  // Initiate connection
  xhttp.open("POST", "addData", true);

  // Header information
  xhttp.setRequestHeader("Content-type", "application/json");

  // Send request
  xhttp.send(JSON.stringify(new_hotel));
}
