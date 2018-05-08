var user;

// =========== MAIN FUNCTIONS ============== //
$( document ).ready(function() {
  'use strict';
  sizes();

  document.querySelectorAll('input[data-required]').forEach(function (e) {
     e.required = true;
  });

  sessionCheck();
});

// ============ OTHER =============== //

function sessionCheck() {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState==4 && this.status == 200) {
      // If not logged in
      if (JSON.parse(xhttp.responseText).login == 0) {
        $('#menuItemUser').hide();
        $('#menuItemManager').hide();
        $('#menuItemLogout').hide();
        $('#menuIcon').html('more_vert');
        mdl_upgrade();
        return;
      }
      
      // If logged in
      user = JSON.parse(xhttp.responseText);
      $('#menuItemLogin').hide();
      if (user.manageracc == 0) {
        $('#menuItemManager').hide();
        mdl_upgrade();
      }
      $('#menuIcon').html('account_circle');
      mdl_upgrade();
      console.log(user);
    }
  };
  xhttp.open('GET', 'usersession.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

function logout() {
  let xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'logout', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

function sizes() {
  "use strict";
  var headerHeight = $("header").height();
  var footer = $("footer");
  var content = $("#content");

  // FOOTER POSITIONING
  if (content.height() < parseInt(window.innerHeight,10) - headerHeight) { footer.css("position", "absolute"); }
  else { footer.css("position", "relative"); }
}

window.onresize = function(event) {
  "use strict";
  sizes();
  //bookingData();
};

// =========== UPDATE MDL FOR DYNAMICALLY CREATED OBJECTS =========== //
// Dynamically created material objects must be manually 'upgraded'
function mdl_upgrade() {
  "use strict";
  if(typeof(componentHandler) != 'undefined'){
    componentHandler.upgradeAllRegistered();
  }
}

function includeHTML() {
  "use strict";
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("data-w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("data-w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
}
