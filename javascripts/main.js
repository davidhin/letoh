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

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}
