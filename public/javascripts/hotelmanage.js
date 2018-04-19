// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
  "use strict";
  mgr_overview();
  loadHotelSidebar();
});

// =========== LOAD CONTENT ============== //
function hideContent() {
  "use strict";
  // Hide other cards
  $('#content').children('div').each(function() {
    $(this).hide();
  });
}

function mgr_info(hotelInput) {
  "use strict";
  // Current selected hotel
  var hotel_id = $(hotelInput).attr('id');

  // Get the information for the hotel corresponding to hotel_0
  // And display it in the hotel manager cards
  $('#mgr_desc').empty();
  /* --- DYNAMIC --- */
  // mgr desc header
  $('<h4/>').html(hotel_id + " Description").appendTo("#mgr_desc"); 
  /* --- DYNAMIC --- */
  var mgr_desc_content = $('<p/>').html("This is the description for " + hotel_id).appendTo("#mgr_desc");  
  // mgr desc button
  $('<button/>')
    .addClass("editButton mdl-button mdl-js-button mdl-button--primary")
    .html("edit").appendTo("#mgr_desc")
    .click(function() { btn_editText("#mgr_desc", this, mgr_desc_content); });

  // Show current card
  hideContent();
  $("#generalInfo").show(); 
  sizes();
}

function mgr_room(hotelInput) {
  "use strict";
  // Current selected hotel
  var hotel_id = $(hotelInput).attr('id');
  var roomTypes = 2;

  // Get the types of rooms for this hotel and information
  $("#roomTypes").empty();  
  for (let i = 0; i < roomTypes; i++) {
    var room_row = $('<div/>').addClass("mdl-grid").appendTo("#roomTypes");   
      // room info
      $('<div/>')
      .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col mdl-cell--3-col-tablet mdl-cell--1-col-phone")
      .appendTo(room_row);
      var room_desc = $('<div/>')
      .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--8-col mdl-cell--5-col-tablet mdl-cell--1-col-phone")
      .appendTo(room_row);
      /* --- DYNAMIC --- */
      //room desc header  
      $('<h4/>').html("Room" + i + " Description").appendTo(room_desc);
      // room_desc_content
      $('<p/>').html("This is the description for room type " + i + " of " + hotel_id).appendTo(room_desc);
      // room_desc_editBtn
      $('<button/>')
        .addClass("editButton mdl-button mdl-js-button mdl-button--primary")
        .html("edit").appendTo(room_desc)
        .click(function() { btn_editText($(this).closest('.mdl-cell'), this, $(this).siblings('p')); });
  }
    
  // "Add a room" button
  var addButton = $('<button/>')
              .addClass("addButton mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored")
          .appendTo("#roomTypes");
  $('<i/>').addClass("material-icons").html("add").appendTo(addButton);

  // Show current card
  hideContent();
  $("#roomTypes").show(); 
  sizes();
}

function mgr_overview() {
  "use strict";
  hideContent();
  sizes();
  
  // Get hotel information and display it
  // TO BE IMPLEMENTED
}

// =================== GENERALISED IMPORTANT STUFF ========================= //

// EDIT A TEXT FIELD AND SUBMIT IT
// Edit button is the button that must be pressed to edit
// Content in is the content that is to be changed
function btn_editText(container, editBtn, contentIn) {
  "use strict";
  $(editBtn).hide();
  $(contentIn).hide();
  var div_textarea = $('<div/>')
    .css("width", "100%")
    .addClass("mdl-textfield mdl-js-textfield")
    .appendTo(container);
  var input_textarea = $('<textarea/>')
      .addClass("mdl-textfield__input")
      .attr({"type": "text", "id": "text_desc", "rows":4})
      .css("resize", "none")
    /* --- DYNAMIC --- */
    .val($(contentIn).html())
      .appendTo(div_textarea);
  // label_line
  $('<label/>')
    .addClass("mdl-textfield__label")
    .appendTo(div_textarea);
  
  var button_area = $('<div/>')
    .css("padding", "15px 0 0 0")
    .css("text-align", "right")
    .addClass("mdl-card__actions")
    .appendTo(container);
  // submitButton
  $('<a/>')
    .html("submit")
    .addClass("lowButton mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent")
    .appendTo(button_area)
    .click(function() {
      /* --- DYNAMIC --- */
      $(contentIn).html(input_textarea.val());
      $(contentIn).show();
      $(editBtn).show();
      input_textarea.remove();
      div_textarea.remove();
      button_area.remove();
    });
  // cancelButton
  $('<a/>')
    .html("cancel")
    .addClass("lowButton mdl-button mdl-js-button")
    .appendTo(button_area)
    .click(function() {
      $(contentIn).show();
      $(editBtn).show();
      input_textarea.remove();
      div_textarea.remove();
      button_area.remove();
    });
  mdl_upgrade();
}

// =========== LOAD SIDEBAR ============== //
// e.g. for all of the owners hotels, generate the following links:
function loadHotelSidebar() {
  "use strict";
  for (var i = 0; i < 3; i++) {
    $('<button/>')
        .text('Dynamically Added Hotel ' + i)
      .addClass("mdl-button mdl-js-button mdl-js-ripple-effect accordion")
      .css("text-transform", "none")
      .appendTo("#myHotels");
    var currId = "myHotel_" + i;
    $('<div/>').attr("id", currId).addClass("panel").appendTo("#myHotels");
    $('<a/>').click(function() { mgr_info(this.closest('div')); mdl_upgrade(); }).html("General Info").addClass("mdl-navigation__link").appendTo("#" + currId);
    $('<a/>').click(function() { mgr_room(this.closest('div')); mdl_upgrade(); }).html("Room Types").addClass("mdl-navigation__link").appendTo("#" + currId);
  //  $('<a/>').click(function() { alert('foo2'); }).html("Reviews").addClass("mdl-navigation__link").appendTo("#" + currId);
  //  $('<a/>').click(function() { alert('bar2'); }).html("Special Offer").addClass("mdl-navigation__link").appendTo("#" + currId);
  }

  // ------------- ACCORDIAN ------------ //
  var acc = document.getElementsByClassName("accordion");
    
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight){
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
}

