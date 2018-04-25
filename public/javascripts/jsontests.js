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

  //---------- Place autocomplete testing ----------//
  var input = document.getElementById('mainSearch');
  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
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
      hotels = JSON.parse(xhttp.responseText);

      // Clear map
      clearMarkers();

      // Populate map
      addMarkers();
    }
  };

  // Initiate connection
  xhttp.open("GET", "getHotels.json", true);
  // Header information
  xhttp.setRequestHeader("Content-type", "application/json");

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
      label: {
        text: hotels[i].price,
        color: "#000000",
        fontSize: "16px",
        fontWeight: "bold"

      },

      map: map
    });

    //Infowindow made here
    //infowindow = new google.maps.InfoWindow();

    infowindow = new google.maps.InfoWindow({
      maxWidth: 250
    });

    google.maps.event.addListener(marker, 'click', function() {
      //Rating System
      var stars = "";
      for(var j=0;j<hotels[i].rating;j++){
        stars += "&#10029;";
      }
      for(var k=hotels[i].rating;k<5;k++){
        stars += "&#10025;";
      }

      infowindow.setContent(
        '<div style="width:250px;min-height:100px;margin-top:5px">'+
        '<div style="float:left">'+
        '<img src="'+
        'https://placeimg.com/640/480/any/' + i +
        '" alt="hotel" title="Your Hotel" style="height:100px;width:100px;object-fit: cover;margin:auto;display:block"></div>'+

        '<div style="float:left;margin-left:10px;max-width:140px">'+
        '<div style="word-break:keep-all;display:block;font-size:15px"><b>'+hotels[i].name+'</b></div>'+

        '<p style="margin:0px;margin-top:10px;padding:0px;">'+
        hotels[i].price+
        '</p>'+

        '<p style="margin:0px;margin-top:10px;padding:0px;">'+
        stars+
        '</p>'+

        '</div>'+
        '</div>'+

        '<div width="100px" style="display:block;padding:0px;margin-top:10px;float:left">'+
        '<button onclick="hoteldetailsMarker('+i+')">Details</button>'+
        '</div>'

      );
      infowindow.open(map, this);
    });

    // Add to markers array
    markers.push(marker);
  }
}

// Send data to json file
function addHotel() {
  var new_hotel = {name:"hotel4",lat:23,lng:25};
  // Create new AJAX request
  var xhttp = new XMLHttpRequest();

  // Define behaviour for a response
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  // Initiate connection
  xhttp.open("POST", "/addHotel", true);
  // Header information
  xhttp.setRequestHeader("Content-type", "application/json");
  // Send request
  xhttp.send(JSON.stringify(new_hotel));
}

function hoteldetailsMarker(index) {
  $('#confirmation_overlay').fadeOut();
  $('#hd_hotelname').html(hotels[index].name);
  $('#hotel_info_p').html(hotels[index].desc);
  $('#hoteldetails_overlay').fadeIn();
  // DYNAMIC DATA: Get the image
  var getimage = "url('https://placeimg.com/640/480/any/" + index + "') center / cover";
  console.log(getimage);
  $('.imagescroller').css("background", getimage);
  $('#hd_backbutton').click(function() { $('#hoteldetails_overlay').fadeOut(); sizes(); });

  bookingpage.call(this);
  mdl_upgrade();
}

// =============================== UNUSED ============================== //
// Send data to json file
// function sendData_old() {
//   var new_hotel = {name:"hotel4",lat:23,lng:25};
//   // Create new AJAX request
//   var xhttp = new XMLHttpRequest();
//
//   // Define behaviour for a response
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//     }
//   };
//
//   // Initiate connection
//   xhttp.open("POST", "addData", true);
//
//   // Header information
//   xhttp.setRequestHeader("Content-type", "application/json");
//
//   // Send request
//   xhttp.send(JSON.stringify(new_hotel));
// }
