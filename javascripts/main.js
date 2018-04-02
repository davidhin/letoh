// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
});

// ============ OTHER =============== //

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
