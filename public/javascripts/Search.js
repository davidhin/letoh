var hotels = [];
var filtered = [];
var distances = [];


// ====================== MAIN FUNCTIONS ===================== //

$(document).ready(function() {
  'use strict';
  $('#price').change(function() {
    $('#maxPrice').val($('#price').val());
  });
  $('#dist').change(function() {
    $('#maxDist').val($('#dist').val());
  });
  $('#stars').change(function() {
    $('#minStars').val($('#stars').val());
  });

  requestHotels(function() {
    hotelCards();
    sizes();
    date_initial();
    check_inputs();
    initMap();
    $('#map').hide();
  });
});

// THERE HAS TO BE A WAY TO REUSE THIS FUNCTION FROM HOTELMANAGE.JS SINCE IT'S LITERALLY THE SAME
// MAYBE YOU CAN JUST CALL IT THE SAME, I'LL LEAVE IT HERE FOR NOW THOUGH
function requestHotels(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      hotels = JSON.parse(xhttp.responseText);
      callback();
    }
  };

  xhttp.open("GET", "getHotels.json", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

}

// ============ DYNAMIC DATA GENERATION: HOTEL CARDS ========= //

function link_moredetails(index) {
  "use strict";
  return function() {
    hoteldetails.call(this, index);
  };
}

function toRadians(valu) {
  return valu * Math.PI / 180;
}

/**
 * Show hotel cards taking into account filters
 */
function hotelCards() {
  showHotels();
  $('#hotelcards').empty();
  mdl_upgrade();
  $('#hoteldetails_overlay').fadeOut();

  filtered = [];
  distances = [];

  /*var NewTestMapCenter = map.getCenter();
  var latit = NewTestMapCenter.lat();
  var longti = NewTestMapCenter.lng();


  var lat = latit;
  var lng = longti;
  console.log(NewTestMapCenter.lat());
  console.log(NewTestMapCenter.lng());*/

  var lat = -34.9284989;
  var lng = 138.6007456;


  for (let i = 0; i < hotels.length; i++) {
    var Radii = 6371000; // metres
    var lat2 = hotels[i].lat;
    var lng2 = hotels[i].lng;
    var φ1 = toRadians(lat);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians((lat2 - lat));
    var Δλ = toRadians((lng2 - lng));

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = Radii * c;
    d = d / 1000;
    distances.push(d);
  }

  for (let i = 0; i < hotels.length; i++) {
    if (hotels[i].price <= $('#price').val()) {
      if (hotels[i].rating >= $('#stars').val()) {
        if (distances[i] <= $('#dist').val()) {
          if (hotels[i].minOccupants >= $('#occupants').val()) {
            filtered.push(hotels[i]);
          }
        }
      }
    }
  }
  var maxprices = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i].price > maxprices) {
      maxprices = filtered[i].price;
    }
  }

  //$('#dist').max() = maxprices;
  // var testing = document.getElementById("dist").max = maxprices;

  for (let i = 0; i < filtered.length; i++) {
    var div_main = $('<div/>').addClass("hotel-card mdl-card mdl-shadow--2dp").appendTo("#hotelcards");
    // Change the background picture here
    var insertBg = "url('images/" + filtered[i].id + ".jpg') center / cover";
    var div_title = $('<div/>').addClass("mdl-card__title").appendTo(div_main).css("background", insertBg);
    // Change the hotel name here
    $('<h2/>').addClass("mdl-card__title-text").html(filtered[i].name).appendTo(div_title);
    // Change the hotel details here
    $('<p/>').addClass("mdl-card__supporting-text").html("From " + "$" + filtered[i].price.toString() + " per night.").appendTo(div_main);
    $('<div/>').addClass("mdl-card__supporting-text").html(filtered[i].desc).appendTo(div_main);
    var div_buttons = $('<div/>').addClass("mdl-card__actions mdl-card--border").appendTo(div_main);
    $('<a/>')
      // CHANGE THIS EVENTUALLY
      // .attr("href", "hoteldetails.html")
      .click(link_moredetails.call(this, filtered[i]))
      .addClass('mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent').html('More details').appendTo(div_buttons);
  }

}

/**
 * This function controls the hotel details overlay that appears
 * when the user clicks the 'more details' button for a hotel
 * @param {num} index The selected hotel's ID
 */
function hoteldetails(hotelInput) {
  // Request rooms from server
  let allrooms = [];
  let rooms = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allrooms = JSON.parse(xhttp.responseText);


      for (let i = 0; i < allrooms.length; i++) {
        if (allrooms[i].price <= $('#price').val()) {
          if (allrooms[i].stars >= $('#stars').val()) {
            if (allrooms[i].occupants >= $('#occupants').val()) {
              rooms.push(allrooms[i]);
            }
          }
        }
      }
      $('#hotel_info_room').empty();
      for (let i = 0; i < rooms.length; i++) {
        let stars = getStars(rooms[i].stars);
        let roomForBooking = $('#hotel_info_room').append('<h3>' + rooms[i].name + '</h3><p class="roomPrice">Room for ' + rooms[i].occupants + ', $' + rooms[i].price + ' per night / ' + stars + '</p><p>' + rooms[i].description + '</p>');
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent')
          .html('Book Now')
          .appendTo(roomForBooking)
          .click(function() {
            bookingpage(hotelInput, rooms[i], 1);
          });
        $('<button/>')
          .addClass('mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent reviewAccordion')
          .html('Reviews')
          .css('text-transform', 'none')
          .appendTo(roomForBooking);
        $('<div/>').attr('id', rooms[i].roomid).addClass('reviewPanel').appendTo(roomForBooking);
        reviewFilling(rooms[i].roomid, roomForBooking, hotelInput);
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
  xhttp.open('POST', 'getRooms.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotelInput));

  $('#confirmation_overlay').fadeOut();
  $('#hd_hotelname').html(hotelInput.name);
  $('#hotel_info_p').html(hotelInput.desc);
  $('#hoteldetails_overlay').fadeIn();
  // DYNAMIC DATA: Get the image
  var getimage = $(this).parents("div").siblings(".mdl-card__title").css("backgroundImage") + " center / cover";
  $('.imagescroller').css("background", getimage);
  $('#hd_backbutton').click(function() {
    $('#hoteldetails_overlay').fadeOut();
    sizes();
  });

  mdl_upgrade();
}

function reviewFilling(id, booking, hotel) {
  let reviews = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      reviews = JSON.parse(xhttp.responseText);

      if (reviews.length === 0) {
        $('<h5/>')
          .html("There are no reviews for this room.<br><br>Be the first to review this room!")
          .appendTo('#' + id);
        return;
      }

      for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].roomid == id) {

          var stars = getStars(reviews[i].stars);

          $('<h5/>')
            .html(reviews[i].name_first)
            .appendTo('#' + id);
          $('<p/>')
            .html(stars + '<br>' + reviews[i].review)
            .appendTo('#' + id);
        }
      }
    }
  };

  xhttp.open('POST', 'getReviews.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotel));
}

function getStars(length) {
  if (length == 6) {
    return "No ratings";
  }
  var stars = "";
  for (var j = 0; j < length; j++) {
    stars += "&#10029;";
  }
  for (var k = length; k < 5; k++) {
    stars += "&#10025;";
  }
  return stars;
}

/**
 * This function executes when the user presses the Book Now button
 * @param {hotelObject} hotelInput The selected hotel
 * @param {roomObject} roomInput The room object corresponding
 *   to the selected room for the selected hotel
 */
function bookingpage(hotelInput, roomInput, variable) {

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (JSON.parse(xhttp.responseText).login !== 0) {
        $('.userHidden').remove();

        loginInputRed();
      }
    }
  };
  xhttp.open('GET', '/usersession.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();

  $('#map').hide();
  $('.mdl-layout__content').animate({
    scrollTop: 0
  });
  $('#bookingpage_overlay').show();
  $('#hoteldetails_overlay').fadeOut();
  $('#hotelcards').fadeOut();

  $('.bookingContent').fadeIn(function() {
    sizes();
  });
  bookingData(hotelInput, roomInput);
  $('#hotelname_underbox').css('margin-bottom', 0).html(hotelInput.name);

  // Show main image
  //$('.boximage').html('This is the main image for ' + hotelInput.name);
  $('.boximage').html("<img alt='Hotel' title='Your Hotel' class='boximage' src='images/" + hotelInput.id + ".jpg'>");

  // Cancel and go back
  $('#bk_backbutton').click(function() {
    $('footer').css('margin-top', '0px');
    $('#hotelcards').fadeIn();
    $('#hoteldetails_overlay').fadeIn();
    $('.bookingContent').fadeOut(function() {
      $('#bookingpage_overlay').hide();
    });
  });

  // Not sure what is going on here, Justin, during merge
  $('#bk_backbutton').click(function() {
    $('footer').css("margin-top", "0px");

    if (variable == 1) {
      $('#hotelcards').fadeIn();
    } else {
      $('#map').show();
      $('#hotelcards').css('display', 'none');
      $('#hotelcards').hide();
    }
  });

  // Confirm and book
  $('button[name="CompleteBooking"]').click(function() {
    submitted(hotelInput, roomInput, variable);
  });
}

// ====================== MISC FUNCTIONS  =================== //
// Get Date
Date.prototype.today = (function(tomorrow) {
  "use strict";
  var local = new Date(this);
  if (tomorrow) {
    local.setDate(local.getDate() + 1);
  }
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

function date_initial() {
  "use strict";
  var a = moment();
  var b = moment().add(1, 'days');
  $('#check-in').val(a.format('YYYY-MM-DD'));
  $('#check-out').val(b.format('YYYY-MM-DD'));

  // Update on blur
  $('#check-in, #check-out, #room-num, #adult-num, #child-num').blur(function() {
    bookingData();
  });
}

function check_inputs() {
  "use strict";
  var nodeList = document.querySelectorAll('.mdl-textfield');
  Array.prototype.forEach.call(nodeList, function(elem) {
    elem.MaterialTextfield.checkDirty();
  });
}

// ====================== Map FUNCTIONS  =================== //

function mapGeneral() {
  $('#hotelcards').toggle(function() {
    currentView = 1;
  });
  $('#map').toggle(function() {
    currentView = 0;
  });
  sizes();
}
