// =========== MAIN FUNCTIONS ============== //

$( document ).ready(function() {
	sizes();
});

// ============ OTHER =============== //

function sizes() {
    var headerHeight = document.getElementsByTagName("header")[0].offsetHeight;
    var footer = document.getElementsByTagName("footer")[0];
	var content = document.getElementById("content");

    // FOOTER POSITIONING 
    if (content.offsetHeight < parseInt(window.innerHeight,10) - 90) { footer.style.position = "absolute"; } 
	else { footer.style.position = "relative"; }
}

onload = function() {	
	sizes();
};

window.onresize = function(event) {
    sizes();
};
