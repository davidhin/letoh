// On load functions
onload = function() {
	for (var i = 0; i < 5; i++) {
		var newHotelCard = document.createElement("div");
        newHotelCard.classList.add("hotelCard");
        document.getElementById("content").appendChild(newHotelCard);
    }

    document.getElementById('check-in').value = new Date().today();
	document.getElementById('check-out').value = new Date().tomorrow();
	
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

    content.style.marginLeft = sidebarOffset + "px";
    sidebar.style.marginTop = headerHeight + "px";
    sidebar.style.height = parseInt(window.innerHeight,10) - 2*headerHeight + 20 + "px";

    // FOOTER POSITIONING 
    footer.style.marginLeft = sidebarOffset + "px"; 
    footer.style.width = parseInt(window.innerWidth,10) - sidebarOffset - 4 + "px"; 
    if (content.offsetHeight < parseInt(window.innerHeight,10)) {
        footer.style.position = "absolute";
    } else {
        footer.style.position = "relative";
    }
}

function dollar() {
	var curValue = document.getElementById("maxPrice").value;
	if (curValue.charAt(0) != "$") {
		document.getElementById("maxPrice").value = "$" + curValue;
	}
};

// Get Dates
Date.prototype.today = (function() { 
	var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
Date.prototype.tomorrow = (function() { 
	var local = new Date(this);
	local.setDate(local.getDate() + 1);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

function isBeforeToday(date){
  var today = new Date((new Date()).toString().substring(0,15));
  return date < today;
}

function dateOrder(date1, date2){
  return date1 > date2;
}

