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

});

// ============ OTHER =============== //

onload = function() {
	// Add hotel cards
	for (var i = 0; i < 9; i++) {
		var newHotelCard = document.createElement("div");
		var image = document.createElement("img");
		image.src = "https://www.w3schools.com/html/pulpitrock.jpg";
        newHotelCard.classList.add("hotelCard");
		newHotelCard.appendChild(image);
        document.getElementById("content").appendChild(newHotelCard);
    }

    document.getElementById('check-in').value = new Date().today(false);
	document.getElementById('check-out').value = new Date().today(true);
	var checkInDay = document.getElementById('check-in').value;
	var checkOutDay = document.getElementById('check-out').value;

	sizes();
};

window.onresize = function(event) {
    sizes();
};

function sizes() {
    var headerHeight = document.getElementsByTagName("header")[0].offsetHeight;
    var footer = document.getElementsByTagName("footer")[0];
	var content = document.getElementById("content");
    var sidebar = document.getElementById("sidebar");
	var sidebarOffset = document.getElementById("sidebar").offsetWidth;

//	content.style.width = parseInt(window.innerWidth,10) + "px";
    content.style.marginLeft = sidebarOffset + "px";
    content.style.width = parseInt(window.innerWidth,10) - sidebarOffset + "px";
    sidebar.style.marginTop = headerHeight + "px";
    sidebar.style.height = parseInt(window.innerHeight,10) - 64 + "px";

    // FOOTER POSITIONING 
    if (content.offsetHeight < parseInt(window.innerHeight,10) - 90) { footer.style.position = "absolute"; } 
	else { footer.style.position = "relative"; }
}

// Get Date
Date.prototype.today = (function(tomorrow) { 
	var local = new Date(this);
	if (tomorrow) { local.setDate(local.getDate() + 1); }
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

// Menu button
$("#sidebarButton").one("click", handler2);
function handler1() {
	$("#sidebar").stop().animate({ width: 0 }, 'fast', function() { 
		$("#sidebar").css("padding", "0px");
	    sizes();
	});
	$(this).one("click", handler2);
}
function handler2() {
	$("#sidebar").css("padding", "20px");
	$("#sidebar").stop().animate({ width: "100%" }, 'fast', function() { 
		sizes();
	}); 
    $(this).one("click", handler1);
}
