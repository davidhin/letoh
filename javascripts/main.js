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
  console.log(content.offsetHeight);
  console.log(window.innerHeight);
  console.log(" ");
  if (content.offsetHeight < parseInt(window.innerHeight,10) - headerHeight) { footer.style.position = "absolute"; } 
  else { footer.style.position = "relative"; }
}

window.onresize = function(event) {
  sizes();
};

// =========== UPDATE MDL FOR DYNAMICALLY CREATED OBJECTS =========== //
// Dynamically created material objects must be manually 'upgraded'
function mdl_upgrade() {
  if(!(typeof(componentHandler) == 'undefined')){
    componentHandler.upgradeAllRegistered();
  }
}
