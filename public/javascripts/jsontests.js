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
    //infowindow = new google.maps.InfoWindow();

    infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(
            '<div style="width:250px;min-height:100px;margin-top:5px">'+
            '<div style="float:left">'+
            '<img src="'+
            "http://lorempixel.com/400/400/city/" +(i+1)+
            '" alt="hotel" title="Your Hotel" style="height:100px;width:100px;object-fit: cover;margin:auto;display:block"></div>'+

            '<div style="float:left;margin-left:10px;">'+
            '<div style="display:block;font-size:15px"><b>'+hotels[i].name+'</b></div>'+

            '<div style="display:block;margin-top:10px">'+
            '<img alt="wifi" title="wifi" src="images/wifi.png" />'+
            '<img alt="coffee" title="coffee" src="images/coffee.png" />'+
            '<img alt="car" title="car" src="images/car.png" />'+
            '<img alt="shower" title="shower" src="images/shower.png" />'+
            '</div>'+

            '<p style="margin:0px;margin-top:10px;padding:0px;">'+
            'price'+ //PRICE HERE
            '</p>'+

            '<p style="margin:0px;margin-top:10px;padding:0px;">'+
            'review'+ //REVIEw HERE
            '</p>'+

            '</div>'+
            '</div>'+

            '<div width="100px" style="display:block;padding:0px;margin-top:10px;float:left">'+
            '<p style="padding:0px;margin:0px">'+'DESCRIPTION GOES HERE'+'</p>'+ //Description here
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
