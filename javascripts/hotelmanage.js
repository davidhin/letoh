// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
	loadHotels();

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
 
});

function loadHotels() {
	// ---------- GET OWNER'S HOTELS ---------- //
	// e.g. for all of the owners hotels, generate the following links:
	for (var i = 0; i < 3; i++) {
		$('<button/>')
	    	.text('Dynamically Added Hotel ' + i)
			.addClass("mdl-button mdl-js-button mdl-js-ripple-effect accordion")
			.appendTo("#myHotels");
		var currId = "myHotel_" + i;
		$('<div/>').attr("id", currId).addClass("panel").appendTo("#myHotels");
		$('<a/>').click(function() { alert('foo'); }).html("General Info").addClass("mdl-navigation__link").appendTo("#" + currId);
		$('<a/>').click(function() { alert('bar'); }).html("Room Types").addClass("mdl-navigation__link").appendTo("#" + currId);
	}
}

// ============ OTHER =============== //

onload = function() {	
	sizes();
};

window.onresize = function(event) {
    sizes();
};


