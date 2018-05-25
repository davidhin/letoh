var map = null;
var hotels = [];
var markers = [];
var filtered = [];
var distances = [];

// Init map
function initMap() {
  var adl = {lat: -34.9284989, lng: 138.6007456};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: adl,
    streetViewControl: true,
    streetViewControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    },
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }

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
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
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
      filtered.length = 0;
      distances.length = 0;

      var lati = -34.9284989;
      var long = 138.6007456;

      for(let i = 0; i < hotels.length; i++){
        var Radii = 6371000; // metres
        var lat2 = hotels[i].pos_lat;
        var lng2 = hotels[i].pos_lng;
        var φ1 = toRadians(lati);
        var φ2 = toRadians(lat2);
        var Δφ = toRadians((lat2-lati));
        var Δλ = toRadians((lng2-long));

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        var d = Radii * c;
        d = d / 1000;

        distances.push(d);
      }
      /*var j = 0;
      for(let i = 0; i < hotels.length; i++){
        if(hotels[i].price <= $("#price").val()){
          if(hotels[i].rating >= $("#stars").val()){
            if(distances[i] <= $("#dist").val()){
              filtered[j] = hotels[i];
              j++;
            }
          }
        }
      }*/
var j = 0;
      for (let i = 0; i < hotels.length; i++) {
        if (hotels[i].price == null) continue;
        if (hotels[i].rating == null) hotels[i].rating = 1;
        if (hotels[i].price <= $('#price').val()) {
          if (hotels[i].rating >= $('#stars').val()) {
            //if (distances[i] <= $('#dist').val()) {
              // TODO: Uncomment this once getHotels query is fixed
              // if (hotels[i].min_occupants >= $('#occupants').val()) {
            //  console.log(hotels[i]);
              //  filtered.push(hotels[i]);
            //  filtered[j] = hotels[i];
            filtered.push(hotels[i]);
              j++;
              // }
            }
        //  }
        }
      }


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
  var icons;
  for (let i = 0; i < filtered.length; i++) {

    icons = {
      url: "/images/marker.png", // url
  	  scaledSize: new google.maps.Size(54, 30), // scaled size
  	  origin: new google.maps.Point(0,0), // origin
  	  anchor: new google.maps.Point(0, 0), // anchor
      labelOrigin: new google.maps.Point(26,13) //label position
  	};

    // Create new marker

    var marker = new google.maps.Marker({
      position: {lat: filtered[i].pos_lat, lng: filtered[i].pos_lng},
      icon: icons,
      label: {
        text: "$"+filtered[i].price.toString(),
        color: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      zIndex: i,
      map: map
    });

    //Infowindow made here
    //infowindow = new google.maps.InfoWindow();

    infowindow = new google.maps.InfoWindow({
      minWidth: 200
    });

    google.maps.event.addListener(marker, 'click', function() {
      //Rating System
      var stars = "";
      if(filtered[i].rating==6){
        stars = "No ratings";
      }else{
        for(var j=0;j<filtered[i].rating;j++){
          stars += "&#10029;";
        }
        for(var k=filtered[i].rating;k<5;k++){
          stars += "&#10025;";
        }
      }

      infowindow.setContent(
        '<div style="min-width:200px;min-height:100px;margin-top:5px">'+
        '<div style="float:left">'+
        '<img src="'+
        'images/'+filtered[i].main_image+
        '" alt="hotel" title="Your Hotel" style="height:100px;width:100px;object-fit: cover;margin:auto;display:block"></div>'+

        '<div style="float:left;margin-left:10px;max-width:140px">'+
        '<div style="word-break:keep-all;display:block;font-size:15px"><b>'+filtered[i].name+'</b></div>'+

        '<div style="margin:0px;margin-top:10px;padding:0px;">'+
        'From $'+filtered[i].price+' per night.'+
        '</div>'+

        '<p style="margin:0px;margin-top:10px;padding:0px;">'+
        stars+
        '</p>'+

        '</div>'+
        '</div>'+

        '<div width="100px" style="display:block;padding:0px;margin-top:10px;text-align:center;">'+
        '<button id="mapview_detailsbutton_'+i+'" style="margin:auto;">Details</button>'+
        '</div>'
      );

      infowindow.open(map, this);

      let buttonDetails = '#mapview_detailsbutton_' + i;
      $(buttonDetails).click(function() {
        hoteldetailsMarker(filtered[i]);
      });

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

function hoteldetailsMarker(hotel) {

  let allrooms = [];
  let rooms = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allrooms = JSON.parse(xhttp.responseText);

      for (let i = 0; i < allrooms.length; i++) {
        if (allrooms[i].price <= $('#price').val()) {
          if (allrooms[i].stars >= $('#stars').val()) {
            if(allrooms[i].occupants >= $('#occupants').val()){
              rooms.push(allrooms[i]);
            }
          }
        }
      }

      $('#hotel_info_room').empty();
      for (let i=0; i<rooms.length; i++) {
        let stars = getStars(rooms[i].stars);
      let roomForBooking = $('#hotel_info_room').append('<h3>'+rooms[i].name+'</h3><p class="roomPrice">Room for '+rooms[i].occupants+', $'+rooms[i].price+' per night / '+stars+'</p><p>'+rooms[i].description+'</p>');
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent')
          .html('Book Now')
          .appendTo(roomForBooking)
          .click(function() {
            bookingpage(hotel, rooms[i], 0);
          });
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent reviewAccordion')
          .html('Reviews')
          .css('text-transform', 'none')
          .appendTo(roomForBooking);
        $('<div/>').attr('id', rooms[i].room_id).addClass('reviewPanel').appendTo(roomForBooking);
        reviewFilling(rooms[i], roomForBooking,hotel);
        $('<hr>').appendTo(roomForBooking);
      }

      let acc = document.getElementsByClassName('reviewAccordion');
        for (let i = 0; i < acc.length; i++) {
          acc[i].addEventListener('click', function() {
            this.classList.toggle('active');
            let panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
              panel.style.maxHeight = null;
            } else {
              panel.style.maxHeight = panel.scrollHeight + 'px';
            }
          });
        }

    }
  };
  xhttp.open('POST','getRooms.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotel));

  $('#confirmation_overlay').fadeOut();
  $('#hd_hotelname').html(hotel.name);
  $('#hotel_info_p').html(hotel.description);
  $('#hoteldetails_overlay').fadeIn();
  // DYNAMIC DATA: Get the image
  var getimage = "url('images/"+hotel.main_image+"') center / cover";
  //var getimage = "url('https://placeimg.com/640/480/any/" + hotel.id + "') center / cover";
  $('.imagescroller').css("background", getimage);
  $('#hd_backbutton').click(function() { $('#hoteldetails_overlay').fadeOut(); sizes(); });

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
