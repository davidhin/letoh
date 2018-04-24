var hotels = [];

// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
  "use strict";
  requestHotels(function() {  
    loadHotelSidebar();
    mgr_overview();
    sizes();
  });
});

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

  // Get the information for the hotel corresponding to hotel_0
  // And display it in the hotel manager cards
  $('#generalInfo').empty();
  
  /* --- DYNAMIC --- */

  var title_container = $('<div/>').css("margin","0 auto").css("width","auto").appendTo("#generalInfo");
  $('<h1/>')
    .click(function() { 
      btn_editText(title_container, this, this, hotelInput, 'name', 1, function() {
        requestHotels(function() { loadHotelSidebar(); });
      }); 
    })
    .css("font-weight","100").html(hotelInput.name).appendTo(title_container);

  //          <div id="mgr_images" class="mdl-cell mdl-card mdl-shadow--2dp mdl-cell--8-col mdl-cell--5-col-tablet mdl-cell--1-phone">Images</div>
  //          <div id="mgr_tags" class="mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col mdl-cell--3-col-tablet mdl-cell--1-phone">Tags</div>

  // mdl-grid container
  var info_container = $('<div/>').addClass("mdl-grid").appendTo('#generalInfo');
  $('<div/>').attr("id", "mgr_mainImage").addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--3-col-desktop mdl-cell--3-col-tablet mdl-cell--4-phone").html("Main Image").appendTo(info_container);
  $('<div/>').attr("id", "mgr_desc").addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--9-col-desktop mdl-cell--5-col-tablet mdl-cell--4-phone").appendTo(info_container);
  
  // mgr desc header
  $('<h4/>').html("Description").appendTo("#mgr_desc"); 
  /* --- DYNAMIC --- */
  var mgr_desc_content = $('<p/>').html(hotelInput.desc).appendTo("#mgr_desc");  
  // mgr desc button
  $('<button/>')
    .addClass("editButton mdl-button mdl-js-button mdl-button--primary")
    .html("edit").appendTo("#mgr_desc")
    .click(function() { btn_editText("#mgr_desc", this, mgr_desc_content, hotelInput, 'desc', 6, function(){}); });

  // Show current card
  hideContent();
  $("#generalInfo").show(); 
  sizes();
}

function mgr_room(hotelInput) {
  "use strict";
  // Current selected hotel
  var roomTypes = 2;

  // Get the types of rooms for this hotel and information
  $("#roomTypes").empty();  

  // Hotel name title
  var title_container = $('<div/>').css("margin","0 auto").css("width","800px").appendTo("#roomTypes");
  $('<h1/>')
    .click(function() { 
      btn_editText(title_container, this, this, hotelInput, 'name', 1, function() {
        requestHotels(function() { loadHotelSidebar(); });
      }); 
    })
    .css("font-weight","100").html(hotelInput.name).appendTo(title_container);

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
      $('<p/>').html("This is the description for room type " + i + " of " + hotelInput.name).appendTo(room_desc);
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
  $('#hotelOverview').empty();

  var overview_grid = $('<div/>').addClass("mdl-grid").appendTo("#hotelOverview");
  for (let i = 0; i < hotels.length; i++) {
    
    var mgr_overview_card = $('<div/>')
      .addClass("mgr_overview_card mdl-cell mdl-card mdl-shadow--2dp mdl-cell--6-col")
      .appendTo(overview_grid);
    $('<h2/>')
      .css("margin",0)
      .html(hotels[i].name)
      .appendTo(mgr_overview_card);
    $('<p/>')
      .css("margin",0)
      .html(hotels[i].desc)
      .appendTo(mgr_overview_card);
  }

  mdl_upgrade();
  sizes();  

  var addButton = $('<button/>')
    .addClass("newHotelButton addButton mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored")
    .click(function() { addHotelButton(); })
    .appendTo("#hotelOverview");
  $('<i/>').addClass("material-icons").html("add").appendTo(addButton);
  mdl_upgrade();

  hideContent();
  $('#hotelOverview').show();
}

function addHotelButton() {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      requestHotels(function() {
        mgr_overview();
        loadHotelSidebar();
      });
    }
  };

  xhttp.open("POST", "addHotel.json", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}

// =================== GENERALISED IMPORTANT STUFF ========================= //

// EDIT A TEXT FIELD AND SUBMIT IT
// Edit button is the button that must be pressed to edit
// Content in is the content that is to be changed
// Hotel is the actual hotel object in the hotels array
// Type is the hotel detail to be changed, e.g. desc
function btn_editText(container, editBtn, contentIn, hotel, type, rows, callback) {
  "use strict";
  $(editBtn).hide();
  $(contentIn).hide();
  var div_textarea = $('<div/>')
    .css("width", "100%")
    .addClass("mdl-textfield mdl-js-textfield")
    .appendTo(container);
  var input_textarea = $('<textarea/>')
    .addClass("mdl-textfield__input")
    .attr({"type": "text", "id": "text_desc", "rows":rows})
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
      hotel[type] = input_textarea.val();

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200)
        callback(); };
      xhttp.open("POST", "changeHotelDetails.json", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify({'hotel':JSON.stringify(hotel), 'changed_detail':type}));

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
  $('#myHotels').empty();

  // Overview Button
  $('<button/>')
    .attr("id","overview")
    .click(function() { mgr_overview(); sizes(); })
    .addClass("mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary")
    .html("Dashboard")
    .appendTo("#myHotels");

  for (let i = 0; i < hotels.length; i++) {
    $('<button/>')
      .text(hotels[i].name)
      .addClass("mdl-button mdl-js-button mdl-js-ripple-effect accordion")
      .css("text-transform", "none")
      .appendTo("#myHotels");
    var currId = "myHotel_" + i;
    $('<div/>').attr("id", currId).addClass("panel").appendTo("#myHotels");
    $('<a/>').click(function() { mgr_info(hotels[i]); mdl_upgrade(); }).html("General Info").addClass("mdl-navigation__link").appendTo("#" + currId);
    $('<a/>').click(function() { mgr_room(hotels[i]); mdl_upgrade(); }).html("Room Types").addClass("mdl-navigation__link").appendTo("#" + currId);
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

