// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
	mgr_overview();
	loadHotelSidebar();
});

// =========== LOAD CONTENT ============== //
function hideContent() {
	// Hide other cards
	$('#content').children('div').each(function() {
		$(this).hide();
	});
}

function mgr_info(hotelInput) {
	// Current selected hotel
	var hotel_id = $(hotelInput).attr('id');

	// Get the information for the hotel corresponding to hotel_0
	// And display it in the hotel manager cards
	$('#mgr_desc').html("This is the description for " + hotel_id);	


	// Show current card
	hideContent();
	$("#generalInfo").show();	
	sizes();
}

function mgr_room(hotelInput) {
	// Current selected hotel
	var hotel_id = $(hotelInput).attr('id');
	var roomTypes = 2;

	// Get the types of rooms for this hotel and information
	$("#roomTypes").empty();	
	for (i = 0; i < roomTypes; i++) {
		var room_row = $('<div/>').addClass("mdl-grid").appendTo("#roomTypes");		
		  var room_desc = $('<div/>')
			.addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col mdl-cell--3-col-tablet mdl-cell--1-phone")
			.html("This is the description for room type " + i + " of " + hotel_id)
			.appendTo(room_row);
		  var room_info = $('<div/>')
			.addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--8-col mdl-cell--5-col-tablet mdl-cell--1-phone")
			.html("This is the description for room type " + i + " of " + hotel_id)
			.appendTo(room_row);
	}
		
	// "Add a room" button
	var addButton = $('<button/>')
		    	    .addClass("addButton mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored")
					.appendTo("#roomTypes");
	  var plusSign = $('<i/>').addClass("material-icons").html("add").appendTo(addButton);

	// Show current card
	hideContent();
	$("#roomTypes").show();	
	sizes();
}

function mgr_overview() {
	hideContent();
	
	// Get hotel information and display it
	
}

// =========== LOAD SIDEBAR ============== //
// e.g. for all of the owners hotels, generate the following links:
function loadHotelSidebar() {
	for (var i = 0; i < 3; i++) {
		$('<button/>')
	    	.text('Dynamically Added Hotel ' + i)
			.addClass("mdl-button mdl-js-button mdl-js-ripple-effect accordion")
			.css("text-transform", "none")
			.appendTo("#myHotels");
		var currId = "myHotel_" + i;
		$('<div/>').attr("id", currId).addClass("panel").appendTo("#myHotels");
		$('<a/>').click(function() { mgr_info(this.closest('div')); }).html("General Info").addClass("mdl-navigation__link").appendTo("#" + currId);
		$('<a/>').click(function() { mgr_room(this.closest('div')); }).html("Room Types").addClass("mdl-navigation__link").appendTo("#" + currId);
	//	$('<a/>').click(function() { alert('foo2'); }).html("Reviews").addClass("mdl-navigation__link").appendTo("#" + currId);
	//	$('<a/>').click(function() { alert('bar2'); }).html("Special Offer").addClass("mdl-navigation__link").appendTo("#" + currId);
	}

	// ------------- ACCORDIAN ------------ //
	var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
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
