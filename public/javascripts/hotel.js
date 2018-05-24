var bookings_current = [];
var bookings_past = [];
var user;

/* ================== Functions for Both Pages ===================== */
$(document).ready(function() {
  'use strict';
  userSession(function() {
    accountData();
  });
});

/**
 * Get the user corresponding to session id
 * @param {function} callback The callback function on session
 * obtain success
 */
function userSession(callback) {
  // Check if the page loading is the account page or not
  if (window.location.pathname !== '/accountPage.html') {
    return;
  }

  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // If try to access without being logged in
      if (JSON.parse(xhttp.responseText).login === 0) {
        window.location.replace('http://localhost:3000/logsign.html');
        console.log('not logged in');
        return;
      }

      user = JSON.parse(xhttp.responseText);
      console.log(user);
      mdl_upgrade();
      callback();
    }
  };

  xhttp.open('GET', 'usersession.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

/**
 * Check if there are bookings in the current logged in session
 */
function checkIfBookings() {
  'use strict';
  if ($('#currentBookings').children().length === 0) {
    $('#currentBookings').append($('<p style="margin-left:15px"></p>')
      .attr('class', '')
      .text('You have no current bookings')
    );
  }

  if ($('#pastBookings').children().length === 0) {
    $('#pastBookings').append($('<p style="margin-bottom:40px;margin-left:15px"></p>')
      .attr('class', '')
      .text('You have no past bookings')
    );
  }
}

/* ================== Booking Page ===================== */
// Booking Page Information Getting
function bookingData(hotelInput, roomInput) {
  'use strict';
  // Top right box
  $($('.rightcontent p')[0]).text(hotelInput.address);
  $($('.rightcontent p')[1]).text(roomInput.name);
  $($('.rightcontent p')[1]).text(roomInput.name);



  // Date validation
  var check_in = moment($('#check-in').val());
  var check_out = moment($('#check-out').val());
  var diffDays = check_out.diff(check_in, 'days');
  var pastBooking = check_in.diff(moment(), 'days');
  var stay;
  if (diffDays == 1) {
    stay = diffDays + ' night';
  } else if (diffDays > 1) {
    stay = diffDays + ' nights';
  }
  if (pastBooking < 0) {
    alert('Cant book in the past!');
    date_initial();
  }
  if (diffDays <= 0) {
    alert('Invalid date(s)!');
    date_initial();
  }
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
  $($('.rightcontent td.tablerightcol')[3]).text('AU' + ' $' + cost_1);
  $($('.rightcontent td.tablerightcol')[4]).text('AU' + ' $' + cost_2);
  $($('.rightcontent th.tablerightcol')[0]).attr('id', 'totalCost').text('AU' + ' $' + cost_total);

  //Bottom right box
  $('.rightcontent ul.boxparagraph').empty();
  var included = ['1 Bathroom', 'Free Continental Breakfast', 'Free Wifi', 'Free Parking'];
  for (let i = 0; i < included.length; i++) {
    $('.rightcontent ul.boxparagraph').append('<li>' + included[i] + '</li>');
  }
}

function compulsory(index) {
  "use strict";
  if (index.value) {
    index.style.borderColor = "white";
  } else {
    index.style.borderColor = "red";
  }
}

/**
 * The function that is called when user presses the complete booking button
 */
function submitted(hotelInput, roomInput, variable) {

  jQuery.validator.setDefaults({
    debug: true,
    success: 'valid'
  });
  let form = $('#bookingForm');
  form.validate();
  if (form.valid()) {

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
        $('.mdl-layout__content').animate({
          scrollTop: 0
        });
        $('#bookingpage_overlay').fadeOut(function() {
          sizes();
        });
        $('#confirmation_overlay').fadeIn();
        summarise_details(JSON.parse(xhttp.responseText));
      }
    };

    let email = "";
    //checking if there is a session, if there is, just get the email from the session
    //otherwise, pull from the input field
    let xhttpa = new XMLHttpRequest();
    xhttpa.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let user = JSON.parse(xhttpa.responseText);
        if (user.login === 0) {
          email = $('#emailInput').val();
        } else {
          email = user.email;
        }

        let newBooking = {
          'userid': user.user_id,
          'hotelid': hotelInput.hotel_id,
          'hotelname': hotelInput.name,
          'hoteladdress': hotelInput.address,
          'roomid': roomInput.room_id,
          'roomname': roomInput.name,
          'cost': $('#totalCost').html().substring(4),
          'start': moment($('#check-in').val()).format('YYYY-MM-DD'),
          'end': moment($('#check-out').val()).format('YYYY-MM-DD'),
          'comments': $('#extraComments').val(),
          'email': email
        };

        xhttp.open('POST', 'newBooking.json', true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(newBooking));

      }
    };
    xhttpa.open('GET', '/usersession.json', true);
    xhttpa.setRequestHeader('Content-type', 'application/json');
    xhttpa.send();
  } else {
    $('.mdl-layout__content').animate({
      scrollTop: 0
    });
  }
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
  $("#hotelhistory").css("display", "inline");
  $("#accountsettings").css("display", "none");
  window.scrollTo(0, 0);
}

function account() {
  "use strict";
  $("#hotelhistory").css("display", "none");
  $("#accountsettings").css("display", "inline");
  window.scrollTo(0, 0);
}
/* ================== History Page ===================== */
//Account page Information Getting
function accountData() {
  "use strict";
  //Account data

  let password = "";
  for (var i = 0; i < user.user_password.length; i++) {
    password += '&#8226;';
  }

  $($(".accountModule p")[0]).text(user.name_first + " " + user.name_last);
  $($(".accountModule p")[1]).text(user.address);
  $($(".accountModule p")[2]).text(user.phone_number);
  $($(".accountModule p")[3]).text(user.email);
  $($(".accountModule p")[4]).html(password);

  requestBookings(function() {
    for (let i = 0; i < bookings_current.length; i++) {
      get_bookings(bookings_current[i], true);
    }
    for (let i = 0; i < bookings_past.length; i++) {
      get_bookings(bookings_past[i], false);
    }
    // Checking if you have bookings
    checkIfBookings();
    sizes();
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
        let checkout = moment(bookings[i].check_out.substring(0,10), 'YYYY-MM-DD');
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
    .attr('class', 'modulecontainer mdl-grid')
    //Cancel Booking Button
    //.append('<button class="removeBookingButton" onclick="remove(this)">X</button>')
    .appendTo(booking_section);
  // Image Module
  // book image
  $("<div/>")
    .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--3-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<img alt='Hotel' title='Your Hotel' class='boximage'>")
      .attr('src', 'images/' + booking.hotel_id + '.jpg') //CONTENT
    )
    .appendTo(book_container);

  // Description Module
  var book_description = $('<div/>')
    .attr('class', 'descriptmodule')
    .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--5-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<h3 class='hotelboxheadings'></h3>")
      .text(booking.name)
    )
    .append('<h3 class="boxheadings" style="margin-top:0px">Location:</h3>')
    .append($('<p class="boxparagraph"></p>')
      .text(booking.address)
    )
    .append($('<p class="boxparagraph"></p>')
      .text('Booking reference number: ' + booking.ref_num)
    )
    .append($('<p class="boxparagraph"></p>')
      .text('Type: ' + booking.roomname)
    )
    .appendTo(book_container);

  // Table
  var book_table = $('<table class="boxtable"></table>')
    .append($('<tr></tr>')
      .append('<td>Check-in:</td>')
      .append($('<td class="tablerightcol tableFill"></td>')
        .text(moment(booking.check_in.substring(0,10), "YYYY-MM-DD").format('Do MMM YYYY')) // CONTENT
      )
    )
    .append($('<tr></tr>')
      .append('<td>Check-out:</td>')
      .append($('<td class="tablerightcol tableFill"></td>')
        .text(moment(booking.check_out.substring(0,10), "YYYY-MM-DD").format('Do MMM YYYY')) // CONTENT
      )
    )
    .append($('<tr></tr>')
      .append('<td>Length of stay:</td>')
      .append($('<td class="tablerightcol"></td>')
        .text(moment(booking.check_out.substring(0,10), "YYYY-MM-DD").diff(moment(booking.check_in.substring(0,10), "YYYY-MM-DD"), 'days') + " " + "night(s)") //CONTENT
      )
    )
    .append($('<tr></tr>')
      .append('<th class="tabletotal">Total cost</th>')
      .append($('<th class="tablerightcol"></th>')
        .text("AU $" + booking.cost) //CONTENT
      )
    )
    .appendTo(book_description);

  //    if (can_change) {
  //        $('<button class="editBookingedit" onclick="editBookingedit(this)">Change</button>').appendTo(book_table);
  //        $('<button class="confirmBookingedit" onclick="confirmBookingedit(this)">Confirm</button>').appendTo(book_table);
  //        $('<button class="cancelBookingedit" onclick="cancelBookingedit(this)">Cancel</button>').appendTo(book_table);
  //    }

  // Review Module
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let review = JSON.parse(xhttp.responseText);
      if (review.id == -1) {
        $('<div/>')
          .attr('class', 'reviewmodule')
          .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone")
          .append($('<h3 class="hotelboxheadings">Your review</h3>'))
          .append($('<button class="reviewButton" onclick="reviewButton(this)" style="margin:auto">+</button>'))
          .appendTo(book_container);
      } else {
        var stars = "";
        for (var j = 0; j < review.stars; j++) {
          stars += "&#10029;";
        }
        for (var k = review.stars; k < 5; k++) {
          stars += "&#10025;";
        }
        let reviewText = $($.parseHTML(review.review));
        $('<div/>')
          .attr('class', 'reviewmodule')
          .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone")
          .append($('<h3 class="hotelboxheadings">Your review</h3>'))
          .append($('<span>Stars: </span>'))
          .append($('<p>' + stars + '</p>'))
          .append($('<p class="boxparagraph" style="height: 185px; padding-bottom: 0px; white-space: normal; word-break: keep-all; overflow: auto;">' + $(reviewText[0]).text() + '</p>'))
          .appendTo(book_container);
      }

    }

  };
  xhttp.open('POST', '/reviewstuff.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify({
    "refnum": booking.ref_num
  }));

}

function editBookingedit(index) {
  "use strict";
  index.style.display = "none";
  var spanZ = index.parentElement.getElementsByClassName("tableFill")[0];
  $("<form><input class='dateInput' type='date' style='display:inline'></input></form>").appendTo(spanZ);
  var spanO = index.parentElement.getElementsByClassName("tableFill")[1];
  $("<form><input class='dateInput' type='date' style='display:inline'></input></form>").appendTo(spanO);

  $(index).closest('.boxtable').children('.confirmBookingedit').css('display', 'block');
  $(index).closest('.boxtable').children('.cancelBookingedit').css('display', 'block');
}

function confirmBookingedit(index) {
  "use strict";
  index.style.display = "none";
  $(index).closest('.boxtable').children(".cancelBookingedit").css('display', 'none');
  $(index).closest('.boxtable').children(".editBookingedit").css('display', 'block');

  var date = index.parentElement.getElementsByClassName("dateInput");

  if (date[1].value) {
    date[1].parentElement.parentElement.innerText = date[1].value;
    if (date[0].value) {
      date[0].parentElement.parentElement.innerText = date[0].value;
    } else {
      date[0].parentElement.removeChild(date[0]);
    }
  } else if (date[0].value) {
    date[0].parentElement.parentElement.innerText = date[0].value;
    date[0].parentElement.removeChild(date[0]);
  } else {
    date[1].parentElement.removeChild(date[1]);
    date[0].parentElement.removeChild(date[0]);
  }
}

function cancelBookingedit(index) {
  "use strict";
  index.style.display = "none";
  $(index).closest('.boxtable').children(".confirmBookingedit").css('display', 'none');
  $(index).closest('.boxtable').children(".editBookingedit").css('display', 'block');

  var date = index.parentElement.getElementsByClassName("dateInput");
  date[1].parentElement.removeChild(date[1]);
  date[0].parentElement.removeChild(date[0]);
}

function reviewButton(index) {
  "use strict";
  index.style.display = "none";
  var review = index.parentElement;
  $('<span>Stars: </span><select name="reviewStars" class="select"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select><br>').appendTo(review);
  $('<textarea style="resize:none;width:100%;height:80%;display:block;"></textarea>').appendTo(review);
  $('<button class="postButton" onclick="postButton(this)" style="display:block">Post</button>').appendTo(review);
  $('<button class="cancelButton" onclick="cancelButton(this)" style="display:inline">Cancel</button>').appendTo(review);
}

function postButton(index) {
  "use strict";
  //Getting booking refnum
  var gettingRefNum = $($($(index).parent().parent().children()[1]).children()[3]).text();
  var split = gettingRefNum.split(" ");

  var review = index.parentElement;
  var textbox = index.parentElement.getElementsByTagName("TEXTAREA");
  var postbutton = review.getElementsByClassName("postButton");

  //Stars
  var starsVal = $(index).closest('.reviewmodule').children("select").val();
  var stars = "";
  for (var j = 0; j < starsVal; j++) {
    stars += "&#10029;";
  }
  for (var k = starsVal; k < 5; k++) {
    stars += "&#10025;";
  }
  var starReview = document.createElement("P");
  starReview.innerHTML = stars;

  review.insertBefore(starReview, postbutton[0]);

  //Review
  //Will mess up the scroll if changed to jQuery
  var para = document.createElement("P");
  para.className = "boxparagraph";
  para.style.height = "185px";
  para.style.paddingBottom = "0px";
  para.style.marginBottom = "30px;";
  para.style.whiteSpace = "normal";
  para.style.wordBreak = "keep-all";
  para.style.overflow = "auto";
  para.innerText = textbox[0].value;

  review.insertBefore(para, postbutton[0]);

  $(index).closest('.reviewmodule').children("textarea").css('display', 'none');
  $(index).closest('.reviewmodule').children("select").css('display', 'none');
  $(index).closest('.reviewmodule').children(".postButton").css('display', 'none');
  $(index).closest('.reviewmodule').children(".cancelButton").css('display', 'none');

  //Sending review to server
  let xhttpa = new XMLHttpRequest();
  xhttpa.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let bookings = JSON.parse(xhttpa.responseText);
      for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].ref_num == split[3]) {
          var hotelid = bookings[i].hotel_id;
          var roomid = bookings[i].room_id;
        }
      }

      userSession(function() {
        let xhttp = new XMLHttpRequest();
        //console.log(user);
        xhttp.open('POST', '/addReview', true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify({
          "user_id":user.user_id,
          "hotel_id": hotelid,
          "roomid": roomid,
          "refnum": split[3],
          "name": user.name_first+ " " + user.name_last,
          "email": user.email,
          "stars": starsVal,
          "review": textbox[0].value
        }));
      });

    }
  };

  xhttpa.open('GET', '/getBookings.json', true);
  xhttpa.setRequestHeader('Content-type', 'application/json');
  xhttpa.send("");

}

function cancelButton(index) {
  "use strict";
  $(index).closest('.reviewmodule').children('.reviewButton').css('display', 'block');
  $(index).closest('.reviewmodule').children("span").remove();
  $(index).closest('.reviewmodule').children("select").remove();
  $(index).closest('.reviewmodule').children('.postButton').remove();
  $(index).closest('.reviewmodule').children('textarea').remove();
  $(index).remove();
}

function remove(index) {
  "use strict";
  var response = confirm("Are you sure you want to cancel this booking?");
  if (response === true) {
    $(index).parent().remove();
  }

  checkIfBookings();
}

/* ================== Account Page ===================== */
//Edit account setting
function accountChange(index) {
  "use strict";
  $(index).hide();
  let section = $(index).parent();
  $(section).css("height", "50px");
  let prev = $(section).prev();
  $(prev).hide();

  $(index).next().val($(prev).text());
  $(index).next().show();

  $('<a/>').html('submit').addClass('confirm mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent')
    .attr("onclick", "accountConfirm(this)")
    .appendTo(section);
  $('<a/>').html('cancel').addClass('cancel mdl-button mdl-js-button')
    .attr("onclick", "accountCancel(this)")
    .appendTo(section);

}

//Confirming an account setting edit
function accountConfirm(index) {
  "use strict";
  let value = $(index).prev().prev().val();
  let field = $(index).parent().prev().prev().text();
  $(index).next().remove();
  $(index).prev().prev().hide();
  $(index).prev().prev().prev().show();

  if (field == "Password") {
    let passwordDisplay = "";
    for (var i = 0; i < value.length; i++) {
      passwordDisplay += '&#8226;';
    }
    $(index).parent().prev().html(passwordDisplay);
  } else {
    $(index).parent().prev().text(value);
  }

  $(index).parent().prev().show();
  $(index).parent().css("height", "15px");
  $(index).remove();

  let object = {};
  if (field == "Account Name") {
    let split = value.split(" ");
    object = {
      "firstName": split[0],
      "lastName": split[1]
    };
  } else if (field == "Address") {
    object = {
      "address": value
    };
  } else if (field == "Phone Number") {
    object = {
      "phoneNumber": value
    };
  } else if (field == "Email Address") {
    object = {
      "email": value
    };
  } else if (field == "Password") {
    object = {
      "password": value
    };
  }

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/changeUserDetail', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(object));

}

//Cancelling a account setting edit
function accountCancel(index) {
  "use strict";
  $(index).prev().remove();
  $(index).prev().prev().hide();
  $(index).prev().prev().prev().show();
  $(index).parent().prev().show();
  $(index).parent().css("height", "15px");
  $(index).remove();
}
