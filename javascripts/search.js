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
