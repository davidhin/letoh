var users = [];
var bookings_current = [];
var bookings_past = [];

/* ================== Functions for Both Pages ===================== */
$( document ).ready(function() {
  "use strict";
  userData(function() {
    accountData();
  });

});

function userData(callback){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200){
      users = JSON.parse(xhttp.responseText);
      callback();
    }
  };

  xhttp.open("GET", "getUsers.json", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(200);
}

function checkIfBookings(){
  "use strict";
  if($("#currentBookings").children().length===0){
    $("#currentBookings").append($("<p></p>")
      .attr('class','')
      .text("You have no current bookings")
    );
  }

  if($("#pastBookings").children().length===0){
    $("#pastBookings").append($("<p></p>")
      .attr('class','')
      .text("You have no past bookings")
    );
  }
}

/* ================== Booking Page ===================== */
//Booking Page Information Getting
function bookingData(hotelInput, roomInput) {
  'use strict';
  //Top right box
  $($('.rightcontent p')[0]).text(hotelInput.address);
  $($('.rightcontent p')[1]).text(roomInput.name);

  // Date validation
  var check_in = moment($('#check-in').val());
  var check_out = moment($('#check-out').val());
  var diffDays = check_out.diff(check_in, 'days');
  var pastBooking = check_in.diff(moment(), 'days');
  var stay;
  if (diffDays == 1) { stay = diffDays + ' night'; }
  else if (diffDays > 1) { stay = diffDays + ' nights'; }
  if (pastBooking < 0) { alert('Cant book in the past!'); date_initial(); }
  if (diffDays <= 0) { alert('Invalid date(s)!'); date_initial(); }
  check_in = moment($('#check-in').val());
  check_out = moment($('#check-out').val());
  diffDays = check_out.diff(check_in, 'days');

  // Cost calculation
  // DYNAMIC DATA
  var cost_1 = diffDays * roomInput.price;
  var cost_2 = 0.1 * cost_1;
  var cost_total = cost_1 + cost_2;

  // Date summary
  $($('.rightcontent td.tablerightcol')[0]).html(check_in.format('Do MMM YYYY'));
  $($('.rightcontent td.tablerightcol')[1]).html(check_out.format('Do MMM YYYY'));
  $($('.rightcontent td.tablerightcol')[2]).html(stay);

  $($('.rightcontent td:not([class])')[3]).html(stay);
  $($('.rightcontent td.tablerightcol')[3]).text('AU'+' $'+cost_1);
  $($('.rightcontent td.tablerightcol')[4]).text('AU'+' $'+cost_2);
  $($('.rightcontent th.tablerightcol')[0]).attr('id', 'totalCost').text('AU'+' $'+cost_total);

  //Bottom right box
  $('.rightcontent ul.boxparagraph').empty();
  var included=['1 Bathroom', 'Free Continental Breakfast', 'Free Wifi', 'Free Parking'];
  for (let i=0; i<included.length; i++) {
    $('.rightcontent ul.boxparagraph').append('<li>'+included[i]+'</li>');
  }
}

function compulsory(index){
  "use strict";
  if(index.value){
    index.style.borderColor = "white";
  }else{
    index.style.borderColor = "red";
  }
}

/**
 * The function that is called when user presses the complete booking button
 */
function submitted(hotelInput, roomInput, variable) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      $('footer').css('margin-top', '0px');

      if (variable == 1) {
        $('#hotelcards').fadeIn();
      } else {
        $('#map').show();
        $('#hotelcards').css('display', 'none');
        $('#hotelcards').hide();
      }
      $('.mdl-layout__content').animate({scrollTop: 0});
      $('#bookingpage_overlay').fadeOut(function() {
        sizes();
      });
      $('#confirmation_overlay').fadeIn();
      summarise_details(JSON.parse(xhttp.responseText));
    }
  };

  let newBooking = {
    'refnum': Math.floor(Math.random() * 1000000),
    'userid': 0,
    'hotelid': hotelInput.id,
    'hotelname': hotelInput.name,
    'hoteladdress': hotelInput.address,
    'roomid': roomInput.roomid,
    'roomname': roomInput.name,
    'cost': $('#totalCost').html().substring(4),
    'start': moment($('#check-in').val()).format('DD/MM/YYYY'),
    'end': moment($('#check-out').val()).format('DD/MM/YYYY'),
    'comments': $('#extraComments').val(),
    'email': $('#emailInput').val(),
  };

  xhttp.open('POST', 'newBooking.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(newBooking));
}

function summarise_details(details) {
  $('#rc_backbutton').click(function() {
    $('#confirmation_overlay').fadeOut(function() {
      sizes();
    });
  });
  $('#cd_hotelname').css("font-weight", 700).html(details.hotelname);
  $('#cd_bookingnumber').html("Booking number: " + details.refnum);
  $('#cd_email').html("Confirmation email sent to: " + details.email);
  $('#cd_reservation').html("Your reservation: " + details.roomname);
  $('#cd_checkin').html("Check in: " + details.start);
  $('#cd_checkout').html("Check out: " + details.end);
  $('#cd_comments').html("Extra comments: " + details.comments);
  $('#cd_totalcost').html("Total cost: $" + details.cost);
}

/* ================== Changing between Ac/Hi Page ===================== */
function hotels() {
  "use strict";
  $("#hotelhistory").css("display","inline");
  $("#accountsettings").css("display","none");
  window.scrollTo(0, 0);
}

function account(){
  "use strict";
  $("#hotelhistory").css("display","none");
  $("#accountsettings").css("display","inline");
  window.scrollTo(0, 0);
}
/* ================== History Page ===================== */
//Account page Information Getting
function accountData(){
  "use strict";
  //Account data
  $($(".accountModule p")[0]).text(users[0].name);
  $($(".accountModule p")[1]).text(users[0].address);
  $($(".accountModule p")[2]).text(users[0].phoneNumber);
  $($(".accountModule p")[3]).text(users[0].email);
  $($(".accountModule p")[4]).text(users[0].password);

  requestBookings(function() {
    for (let i=0; i<bookings_current.length; i++) {
     get_bookings(bookings_current[i], true);
    }
    for (let i=0; i<bookings_past.length; i++) {
      get_bookings(bookings_past[i], false);
    }
    sizes();

    // Checking if you have bookings
    checkIfBookings();
  });
}

/**
 * Get bookings from server and display them
 * @param {function} callback Run this function when bookings have been sorted
 */
function requestBookings(callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let bookings = JSON.parse(xhttp.responseText);
      for (let i = 0; i < bookings.length; i++) {
        let checkout = moment(bookings[i].end, 'DD/MM/YYYY');
        if ((checkout.diff(moment(), 'days')) < 0) {
          bookings_past.push(bookings[i]);
        } else {
          bookings_current.push(bookings[i]);
        }
      }
      callback();
    }
  };

  xhttp.open('GET', 'getBookings.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

/**
 * Show the bookings (description and review)
 * @param {bookingObject} booking The object containing the bookings
 * @param {bool} can_change (partially deprecated) Whether details can be changed
 */
function get_bookings(booking, can_change) {
  "use strict";
  var booking_section;
  if (can_change) {
  booking_section = "#currentBookings";
  } else {
  booking_section = "#pastBookings";
  }

  // Making Current Bookings modules
  var book_container = $('<div/>')
    .attr('class','modulecontainer mdl-grid')
    //Cancel Booking Button
    //.append('<button class="removeBookingButton" onclick="remove(this)">X</button>')
    .appendTo(booking_section);

  // Image Module
  // book image
  $("<div/>")
  .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--3-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<img alt='Hotel' title='Your Hotel' class='boximage'>")
      .attr('src','images/letoh1.jpg')//CONTENT
    )
    .appendTo(book_container);

  // Description Module
  var book_description = $('<div/>')
    .attr('class','descriptmodule')
    .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--5-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<h3 class='hotelboxheadings'></h3>")
      .text(booking.hotelname)
    )  
    .append('<h3 class="boxheadings" style="margin-top:0px">Location:</h3>')
    .append($('<p class="boxparagraph"></p>')
      .text(booking.hoteladdress)
    )
    .append($('<p class="boxparagraph"></p>')
      .text('Booking reference number: ' + booking.refnum)
    )
    .append($('<p class="boxparagraph"></p>')
      .text('Type: ' + booking.roomname)
    )

  //    .append("<br>")
  //    .append($('<h4 class="boxheadings" style="margin-top:0px">Your Booking Includes:</h4>'))
  //    .append($('<ul class="boxparagraph"></ul>')
  //      .append($('<li></li>')
  //        .text("1 Bathroom")//CONTENT
  //      )
  //      .append($('<li></li>')
  //        .text("Free Continental Breakfast")//CONTENT
  //      )
  //      .append($('<li></li>')
  //        .text("Free Wifi")//CONTENT
  //      )
  //      .append($('<li></li>')
  //        .text("Free Parking")//CONTENT
  //      )
  //    )
  //    .append("<br>")
  .appendTo(book_container);

  // Table
  var book_table = $('<table class="boxtable"></table>')
      .append($('<tr></tr>')
        .append('<td>Check-in:</td>')
        .append($('<td class="tablerightcol tableFill"></td>')
          .text(moment(booking.start, "DD/MM/YYYY").format('Do MMM YYYY')) // CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<td>Check-out:</td>')
        .append($('<td class="tablerightcol tableFill"></td>')
          .text(moment(booking.end, "DD/MM/YYYY").format('Do MMM YYYY')) // CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<td>Length of stay:</td>')
        .append($('<td class="tablerightcol"></td>')
          .text(moment(booking.end,"DD/MM/YYYY").diff(moment(booking.start,"DD/MM/YYYY"), 'days') + " " + "night(s)")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<th class="tabletotal">Total cost</th>')
        .append($('<th class="tablerightcol"></th>')
          .text("AU $" + booking.cost)//CONTENT
        )
      )
    .appendTo(book_description);

  //    if (can_change) {
  //        $('<button class="editBookingedit" onclick="editBookingedit(this)">Change</button>').appendTo(book_table);
  //        $('<button class="confirmBookingedit" onclick="confirmBookingedit(this)">Confirm</button>').appendTo(book_table);
  //        $('<button class="cancelBookingedit" onclick="cancelBookingedit(this)">Cancel</button>').appendTo(book_table);
  //    }

  // Review Module
  $('<div/>')
    .attr('class','reviewmodule')
    .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone")
    .append($('<h3 class="hotelboxheadings">Your review</h3>'))
    .append($('<button class="reviewButton" onclick="reviewButton(this)" style="margin:auto">+</button>'))
    .appendTo(book_container);
}

function editBookingedit(index){
  "use strict";
  index.style.display = "none";
  var spanZ = index.parentElement.getElementsByClassName("tableFill")[0];
  $("<form><input class='dateInput' type='date' style='display:inline'></input></form>").appendTo(spanZ);
  var spanO = index.parentElement.getElementsByClassName("tableFill")[1];
  $("<form><input class='dateInput' type='date' style='display:inline'></input></form>").appendTo(spanO);

  $(index).closest('.boxtable').children('.confirmBookingedit').css('display','block');
  $(index).closest('.boxtable').children('.cancelBookingedit').css('display','block');
}

function confirmBookingedit(index){
  "use strict";
  index.style.display = "none";
  $(index).closest('.boxtable').children(".cancelBookingedit").css('display','none');
  $(index).closest('.boxtable').children(".editBookingedit").css('display','block');

  var date = index.parentElement.getElementsByClassName("dateInput");

  if(date[1].value){
    date[1].parentElement.parentElement.innerText = date[1].value;
    if(date[0].value){
      date[0].parentElement.parentElement.innerText = date[0].value;
    }else{
      date[0].parentElement.removeChild(date[0]);
    }
  }else if(date[0].value){
    date[0].parentElement.parentElement.innerText = date[0].value;
    date[0].parentElement.removeChild(date[0]);
  }else{
    date[1].parentElement.removeChild(date[1]);
    date[0].parentElement.removeChild(date[0]);
  }
}

function cancelBookingedit(index){
  "use strict";
  index.style.display = "none";
  $(index).closest('.boxtable').children(".confirmBookingedit").css('display','none');
  $(index).closest('.boxtable').children(".editBookingedit").css('display','block');

  var date = index.parentElement.getElementsByClassName("dateInput");
  date[1].parentElement.removeChild(date[1]);
  date[0].parentElement.removeChild(date[0]);
}

function reviewButton(index){
  "use strict";
  index.style.display="none";
  var review = index.parentElement;

  $('<textarea style="resize:none;width:100%;height:80%;display:block;"></textarea>').appendTo(review);
  $('<button class="postButton" onclick="postButton(this)" style="display:block">Post</button>').appendTo(review);
  $('<button class="cancelButton" onclick="cancelButton(this)" style="display:inline">Cancel</button>').appendTo(review);
}

function postButton(index){
  "use strict";
  var review = index.parentElement;
  var textbox = index.parentElement.getElementsByTagName("TEXTAREA");

  //Will mess up the scroll if changed to jQuery
  review = index.parentElement;
  textbox = index.parentElement.getElementsByTagName("TEXTAREA");
  var postbutton=review.getElementsByClassName("postButton");
  var para = document.createElement("P");
  para.className="boxparagraph";
  para.style.height="400px";
  para.style.paddingBottom = "0px";
  para.style.marginBottom = "30px;";
  para.style.overflow = "auto";
  para.innerText = textbox[0].value;

  review.insertBefore(para, postbutton[0]);

  $(index).closest('.reviewmodule').children("textarea").css('display','none');
  $(index).closest('.reviewmodule').children(".postButton").css('display','none');
  $(index).closest('.reviewmodule').children(".cancelButton").css('display','none');
}

function cancelButton(index){
  "use strict";
  $(index).closest('.reviewmodule').children('.reviewButton').css('display','block');
  $(index).closest('.reviewmodule').children('.postButton').remove();
  $(index).closest('.reviewmodule').children('textarea').remove();
  $(index).remove();
}

function remove(index){
  "use strict";
  var response = confirm("Are you sure you want to cancel this booking?");
    if(response === true){
      $(index).parent().remove();
    }

    checkIfBookings();
}

/* ================== Account Page ===================== */
function accountChange(index){
  "use strict";
  index.style.display="none";
  $(index).closest('.settingDescription').children('input').css('display','block');

  var buttons = index.parentElement.getElementsByTagName("button");
  buttons[1].style.display="block";
  buttons[2].style.display="inline";
}

function accountConfirm(index){
  "use strict";
  var displaySettings = index.parentElement.getElementsByTagName("p");
  var setting = index.parentElement.getElementsByTagName("input");
  var buttons = index.parentElement.getElementsByTagName("button");

  if(index.parentElement.getElementsByTagName("h4")[0].innerText=="Password"){
    if(setting[0].value){
      displaySettings[0].innerText="";
      for(var i=0;i<setting[0].value.length;i++){
        displaySettings[0].innerText+='*';
      }
    }
  }else{
    for(var ds=0;ds<displaySettings.length;ds++){
      if(setting[ds].value){
        displaySettings[ds].innerText=setting[ds].value;
      }
    }
  }

  $(index).closest('.settingDescription').children('input').hide();
  buttons[0].style.display="block";
  buttons[1].style.display="none";
  buttons[2].style.display="none";
}

function accountCancel(index){
  "use strict";
  $(index).closest('.settingDescription').children('input').hide();

  var buttons = index.parentElement.getElementsByTagName("button");
  buttons[0].style.display="block";
  buttons[1].style.display="none";
  buttons[2].style.display="none";
}
