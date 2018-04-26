var hotels = [];
var filtered = [];

// ====================== MAIN FUNCTIONS ===================== //

$( document ).ready(function() {
  'use strict';
  $( '#price' ).change(function() {
    $( '#maxPrice' ).val($('#price').val());
  });
  $( '#dist' ).change(function() {
    $( '#maxDist' ).val($('#dist').val());
  });
  $( '#stars' ).change(function() {
    $( '#minStars' ).val($('#stars').val());
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
    if (this.readyState == 4 && this.status == 200)
      hotels = JSON.parse(xhttp.responseText);
      callback();
  };

  xhttp.open("GET", "getHotels.json", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();

}

// ============ DYNAMIC DATA GENERATION: HOTEL CARDS ========= //

function link_moredetails() {
  "use strict";
  return function() {
    hoteldetails.call(this);
  };
}

/**
 * Show hotel cards taking into account filters
 */
function hotelCards() {
  $('#hotelcards').empty();
  mdl_upgrade();

  console.log(hotels);
  filtered = [];
  for (let i = 0; i < hotels.length; i++) {
    if (hotels[i].price <= $('#price').val()) {
      if (hotels[i].rating >= $('#stars').val()) {
        filtered.push(hotels[i]);
      }
    }
  }

  console.log(filtered);
  for (let i = 0; i < filtered.length; i++) {
    var div_main = $('<div/>').addClass("hotel-card mdl-card mdl-shadow--2dp").appendTo("#hotelcards");
      // Change the background picture here
      var insertBg = "url('https://placeimg.com/640/480/any/" + i + "') center / cover";
      var div_title = $('<div/>').addClass("mdl-card__title").appendTo(div_main).css("background", insertBg);
      // Change the hotel name here
      $('<h2/>').addClass("mdl-card__title-text").html(filtered[i].name).appendTo(div_title);
      // Change the hotel details here
      $('<div/>').addClass("mdl-card__supporting-text").html(filtered[i].desc).appendTo(div_main);
      var div_buttons = $('<div/>').addClass("mdl-card__actions mdl-card--border").appendTo(div_main);
        $('<a/>')
        // CHANGE THIS EVENTUALLY
        // .attr("href", "hoteldetails.html")
        .click(link_moredetails.call(this))
        .addClass("mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent").html("More details").appendTo(div_buttons);
      // Change the share/favourite button here
      var div_menu = $('<div/>').addClass("mdl-card__menu").appendTo(div_main);
        var button_share = $('<button/>').addClass("mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect").appendTo(div_menu);
        $('<i/>').addClass("material-icons").html("share").appendTo(button_share);
  }
}

function hoteldetails() {
  $('#confirmation_overlay').fadeOut();
  $('#hd_hotelname').html($(this).parents("div").siblings(".mdl-card__title").children().html());
  $('#hotel_info_p').html($(this).parents("div").siblings(".mdl-card__supporting-text").html());
  $('#hoteldetails_overlay').fadeIn();
  // DYNAMIC DATA: Get the image
  var getimage = $(this).parents("div").siblings(".mdl-card__title").css("backgroundImage") + " center / cover";
  $('.imagescroller').css("background", getimage);
  $('#hd_backbutton').click(function() { $('#hoteldetails_overlay').fadeOut(); sizes(); });

  bookingpage.call(this);
  mdl_upgrade();
}

function bookingpage() {
  var getimage = $(this).parents("div").siblings(".mdl-card__title").css("backgroundImage") + " center / cover";
  $('.boximage').css("background", getimage);

  $("#hd_booknow_btn").click(function() {
    $("#map").hide();
    // Maybe fix this - it instant-shows on the first booking button click
    // This could potentially(?) lead to other issues
    $('.mdl-layout__content').animate({ scrollTop: 0 });
    $('#bookingpage_overlay').show();
    $('#hoteldetails_overlay').fadeOut();
    $('#hotelcards').fadeOut();
    $('.bookingContent').fadeIn(function() { sizes(); });
    bookingData();
    var title = $('#hotelname_underbox').css("margin-bottom", 0).html($(this).parents("div").siblings(".mdl-card__title").children().html());

    $('button[name="CompleteBooking"]').click(function() {
      submitted.call(title);
    });

    $('#bk_backbutton').click(function() {
      $('footer').css("margin-top", "0px");
      $('#hotelcards').fadeIn();
      $('#hoteldetails_overlay').fadeIn();
      $('.bookingContent').fadeOut(function() {$('#bookingpage_overlay').hide();});
    });
  });

}

// ====================== MISC FUNCTIONS  =================== //
// Get Date
Date.prototype.today = (function(tomorrow) {
  "use strict";
  var local = new Date(this);
  if (tomorrow) { local.setDate(local.getDate() + 1); }
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function date_initial() {
  "use strict";
  var a = moment();
  var b = moment().add(1, 'days');
  $('#check-in').val(a.format('YYYY-MM-DD'));
  $('#check-out').val(b.format('YYYY-MM-DD'));

  // Update on blur
  $('#check-in, #check-out, #room-num, #adult-num, #child-num').blur(function() { bookingData(); });
}

function check_inputs() {
  "use strict";
  var nodeList = document.querySelectorAll('.mdl-textfield');
  Array.prototype.forEach.call(nodeList, function (elem) {
      elem.MaterialTextfield.checkDirty();
  });
}

// ====================== Map FUNCTIONS  =================== //

function mapGeneral(){
  $('#hotelcards').toggle();
  $('#map').toggle();
}
