// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
	$( "#price" ).change(function() {
		$( "#maxPrice" ).val($("#price").val());
	});
	$( "#dist" ).change(function() {
		$( "#maxDist" ).val($("#dist").val());
	});
	$( "#stars" ).change(function() {
		$( "#minStars" ).val($("#stars").val());
	});

	hotelCards();
});

function hotelCards() {
	for (var i = 0; i < 5; i++) {
		var div_main = $('<div/>').addClass("demo-card-wide mdl-card mdl-shadow--2dp").appendTo("#content");
		  // Change the background picture here
		  var insertBg = "url('http://lorempixel.com/400/400/city/" + i + "') center / cover";
		  var div_title = $('<div/>').addClass("mdl-card__title").appendTo(div_main).css("background", insertBg);
		  // Change the hotel name here
			var h2_title = $('<h2/>').addClass("mdl-card__title-text").html("Hotel " + i).appendTo(div_title);
		  // Change the hotel details here
		  var div_content = $('<div/>').addClass("mdl-card__supporting-text").html("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia... ").appendTo(div_main);
		  var div_buttons = $('<div/>').addClass("mdl-card__actions mdl-card--border").appendTo(div_main);
		  	var a_links = $('<a/>').addClass("mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent").html("More details").appendTo(div_buttons);
		  // Change the share/favourite button here
		  var div_menu = $('<div/>').addClass("mdl-card__menu").appendTo(div_main);
		    var button_share = $('<button/>').addClass("mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect").appendTo(div_menu);
			  var shareButton = $('<i/>').addClass("material-icons").html("share").appendTo(button_share);
	}
}

// ============ OTHER =============== //

onload = function() {	
    document.getElementById('check-in').value = new Date().today(false);
	document.getElementById('check-out').value = new Date().today(true);
	sizes();
};

window.onresize = function(event) {
    sizes();
};

// Get Date
Date.prototype.today = (function(tomorrow) { 
	var local = new Date(this);
	if (tomorrow) { local.setDate(local.getDate() + 1); }
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
