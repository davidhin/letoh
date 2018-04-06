/* ================== Functions for Both Pages ===================== */
function checkIfBookings(){
  if($("#currentBookings").children().length===0){
    $("#currentBookings").append($("<p></p>")
      .attr('class','')
      .text("You have no current bookings")
    );
  }

  if($("#pastBookings").children().length===0){
    $("#pastBookings").append($("<p></p>")
      .attr('class','')
      .text("You have no past bookings")
    );
  }
}

/* ================== Booking Page ===================== */
//Booking Page Information Getting
function bookingData(){
  //Top right box
  $($(".rightcontent p")[0]).text("12"+" Jimmy"+" St");
  $($(".rightcontent p")[1]).text("City"+", "+"State");
  $($(".rightcontent p")[2]).text("Room 1: "+"2 Adults"+", "+"1 King bed");

  $($(".rightcontent td.tablerightcol")[0]).text("2018"+"-"+"05"+"-"+"15");
  $($(".rightcontent td.tablerightcol")[1]).text("2018"+"-"+"05"+"-"+"19");
  $($(".rightcontent td.tablerightcol")[2]).text("4"+" days");

  $($('.rightcontent td:not([class])')[3]).text("4"+" days");
  $($(".rightcontent td.tablerightcol")[3]).text("AU"+" $"+"5000");
  $($(".rightcontent td.tablerightcol")[4]).text("AU"+" $"+"54000");
  $($(".rightcontent th.tablerightcol")[0]).text("AU"+" $"+"59000");

  //Bottom right box
  var included=['1 Bathroom','Free Continental Breakfast','Free Wifi','Free Parking'];
  for(var i=0;i<included.length;i++){
    $(".rightcontent ul.boxparagraph").append("<li>"+included[i]+"</li>");
  }
}

function compulsory(index){
  if(index.value){
    index.style.borderColor = "white";
  }else{
    index.style.borderColor = "red";
  }
}

function submitted(){
    var allCompuls = document.getElementsByClassName('inputbox');
    for(var i=0;i<allCompuls.length;i++){
      console.log(allCompuls[i].name);
      console.log(allCompuls[i].value);
    }

    var allSelect = document.getElementsByTagName('SELECT');
    for(var as=0;as<allSelect.length;as++){
      console.log(allSelect[as].name);
      console.log(allSelect[as].options[allSelect[as].selectedIndex].text);
    }
}

/* ================== Changing between Ac/Hi Page ===================== */
function hotels(){
  $("#hotelhistory").css("display","inline");
  $("#accountsettings").css("display","none");
  window.scrollTo(0, 0);
}

function account(){
  $("#hotelhistory").css("display","none");
  $("#accountsettings").css("display","inline");
  window.scrollTo(0, 0);
}
/* ================== History Page ===================== */
//Account page Information Getting
function accountData(){
  //Account data
  $($(".accountModule p")[0]).text("John"+" Doe");
  $($(".accountModule p")[1]).text("20"+" Jim"+" St"+" Suburb"+" Adelaide");
  $($(".accountModule p")[2]).text("1998 8890");
  $($(".accountModule p")[3]).text("JohnDoe@gfail.com");
  $($(".accountModule p")[4]).text("PasswordMcPasswordFace");

  for(var i=0;i<1;i++){
    get_bookings(false);
  }

  for(var current=0;current<2;current++){
    get_bookings(true);
  }

  //Checking if you have bookings
  checkIfBookings();
}

// Show the bookings (description + review)
// can_change: whether the booking details can be changed
function get_bookings(can_change) {
  var booking_section;
  if (can_change) {
	booking_section = "#currentBookings";
  } else {
	booking_section = "#pastBookings";
  }

  // Making Current Bookings modules
  var book_container = $('<div/>')
    .attr('class','modulecontainer mdl-grid')
    //Cancel Booking Button
    //.append('<button class="removeBookingButton" onclick="remove(this)">X</button>')
    .appendTo(booking_section);

  // Image Module
  var book_image = $("<div/>")
	.addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--3-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<img alt='Hotel' title='Your Hotel' class='boximage'>")
      .attr('src','images/letoh1.jpg')//CONTENT
    )
    .appendTo(book_container);

  // Description Module
  var book_description = $('<div/>')
    .attr('class','descriptmodule')
	.addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--5-col-desktop mdl-cell--4-col-tablet mdl-cell--4-col-phone")
    .append($("<h3 class='hotelboxheadings'></h3>")
      .text('Paradise Interchange Hotel')
    )
    .append('<h3 class="boxheadings">Location:</h3>')
    .append($('<p class="boxparagraph"></p>')
      .text("12 Jimmy Street")//Content
    )
    .append($('<p class="boxparagraph"></p>')
      .text("Adelaide, South Australia")//Content
    )
    .append($('<p class="boxparagraph"></p>')
      .text("Room 1: 2 Adults, 1 King bed")//Content
    )

    .append("<br>")
    .append($('<h4 class="boxheadings">Your Booking Includes:</h4>'))
    .append($('<ul class="boxparagraph"></ul>')
      .append($('<li></li>')
        .text("1 Bathroom")//CONTENT
      )
      .append($('<li></li>')
        .text("Free Continental Breakfast")//CONTENT
      )
      .append($('<li></li>')
        .text("Free Wifi")//CONTENT
      )
      .append($('<li></li>')
        .text("Free Parking")//CONTENT
      )
    )
    .append("<br>")
	.appendTo(book_container);

    //Table
	var book_table = $('<table class="boxtable"></table>')
      .append($('<tr></tr>')
        .append('<td>Check-in:</td>')
        .append($('<td class="tablerightcol tableFill"></td>')
          .text("2018-05-15")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<td>Check-out:</td>')
        .append($('<td class="tablerightcol tableFill"></td>')
          .text("2018-05-19")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<td>Length of stay:</td>')
        .append($('<td class="tablerightcol"></td>')
          .text("4 days")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append($('<td></td>')
          .text("4 days")//CONTENT
        )
        .append($('<td class="tablerightcol"></td>')
          .text("AU $5000")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<td>Taxes</td>')
        .append($('<td class="tablerightcol"></td>')
          .text("AU $54000")//CONTENT
        )
      )
      .append($('<tr></tr>')
        .append('<th class="tabletotal">Total</th>')
        .append($('<th class="tablerightcol"></th>')
          .text("AU $59000")//CONTENT
        )
      )
 	  .appendTo(book_description);

      if (can_change) {
        $('<button class="editBookingedit" onclick="editBookingedit(this)">Change</button>').appendTo(book_table);
        $('<button class="confirmBookingedit" onclick="confirmBookingedit(this)">Confirm</button>').appendTo(book_table);
        $('<button class="cancelBookingedit" onclick="cancelBookingedit(this)">Cancel</button>').appendTo(book_table);
	  }

  // Review Module
  var book_review = $('<div/>')
	  .attr('class','reviewmodule')
	  .addClass("mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col-desktop mdl-cell--8-col-tablet mdl-cell--4-col-phone")
	  .append($('<h3 class="hotelboxheadings">Your review</h3>'))
	  .append($('<button class="reviewButton" onclick="reviewButton(this)">+</button>'))
	  .append($('<button class="postButton" onclick="postButton(this)">Post</button>'))
	  .append($('<button class="cancelButton" onclick="cancelButton(this)">Cancel</button>'))
	  .appendTo(book_container);
}

function editBookingedit(index){
  var date = document.createElement("INPUT");
  var form = document.createElement("FORM");
  date.setAttribute("class","dateInput");
  date.setAttribute("type","date");
  date.style.display="inline";
  form.appendChild(date);

  var dates = document.createElement("INPUT");
  var forms = document.createElement("FORM");
  dates.setAttribute("class","dateInput");
  dates.setAttribute("type","date");
  dates.style.display="inline";
  forms.appendChild(dates);
  var span = index.parentElement.getElementsByClassName("tableFill");

  span[0].appendChild(form);
  span[1].appendChild(forms);

  var confirm = index.parentElement.getElementsByClassName("confirmBookingedit");
  var cancel = index.parentElement.getElementsByClassName("cancelBookingedit");
  confirm[0].style.display = "block";
  cancel[0].style.display = "block";
  index.style.display = "none";
}

function confirmBookingedit(index){
  var date = index.parentElement.getElementsByClassName("dateInput");
  var edit = index.parentElement.getElementsByClassName("editBookingedit");
  var cancel = index.parentElement.getElementsByClassName("cancelBookingedit");
  index.style.display = "none";
  cancel[0].style.display = "none";
  edit[0].style.display = "block";

  if(date[1].value){
    date[1].parentElement.parentElement.innerText = date[1].value;
    if(date[0].value){
      date[0].parentElement.parentElement.innerText = date[0].value;
    }else{
      date[0].parentElement.removeChild(date[0]);
    }
  }else if(date[0].value){
    date[0].parentElement.parentElement.innerText = date[0].value;
    date[0].parentElement.removeChild(date[0]);
  }else{
    date[1].parentElement.removeChild(date[1]);
    date[0].parentElement.removeChild(date[0]);
  }

}

function cancelBookingedit(index){
  var date = index.parentElement.getElementsByClassName("dateInput");
  var confirm = index.parentElement.getElementsByClassName("confirmBookingedit");
  var edit = index.parentElement.getElementsByClassName("editBookingedit");
  confirm[0].style.display = "none";
  index.style.display = "none";
  edit[0].style.display = "block";

  date[1].parentElement.removeChild(date[1]);
  date[0].parentElement.removeChild(date[0]);
}

function reviewButton(index){
  index.style.display="none";
  var review = index.parentElement;
  var postbutton=review.getElementsByClassName("postButton");
  var cancelbutton=review.getElementsByClassName("cancelButton");

  var box = document.createElement("TEXTAREA");
  box.style.resize="none";
  box.style.width="100%";
  box.style.height="80%";
  box.style.display="block";
  review.insertBefore(box, postbutton[0]);

  postbutton[0].style.display="block";
  cancelbutton[0].style.display="inline";
}

function postButton(index){
  var review = index.parentElement;
  var textbox = index.parentElement.getElementsByTagName("TEXTAREA");
  var postbutton=review.getElementsByClassName("postButton");
  var cancelbutton=review.getElementsByClassName("cancelButton");
  var para = document.createElement("P");
  para.className="boxparagraph";
  para.style.height="100%";
  para.style.paddingBottom = "0px";
  para.style.marginBottom = "30px;";
  para.style.overflow = "auto";
  para.innerText = textbox[0].value;

  review.insertBefore(para, postbutton[0]);
  textbox[0].style.display="none";
  postbutton[0].style.display="none";
  cancelbutton[0].style.display="none";
}

function cancelButton(index){
  var review = index.parentElement;
  var textbox = index.parentElement.getElementsByTagName("TEXTAREA");
  var reviewbutton=review.getElementsByClassName("reviewButton");
  var postbutton=review.getElementsByClassName("postButton");
  var cancelbutton=review.getElementsByClassName("cancelButton");
  textbox[0].parentNode.removeChild(textbox[0]);
  postbutton[0].style.display="none";
  cancelbutton[0].style.display="none";
  reviewbutton[0].style.display="block";
}

function remove(index){
  var response = confirm("Are you sure you want to cancel this booking?");
    if(response === true){
      $(index).parent().remove();
    }

    checkIfBookings();
}

/* ================== Account Page ===================== */
function accountChange(index){
  var setting = index.parentElement.getElementsByTagName("input");
  var buttons = index.parentElement.getElementsByTagName("button");
  for(var i=0;i<setting.length;i++){
    setting[i].style.display="block";
  }
  buttons[1].style.display="block";
  buttons[2].style.display="inline";
  index.style.display="none";
}

function accountConfirm(index){
  var displaySettings = index.parentElement.getElementsByTagName("p");
  var setting = index.parentElement.getElementsByTagName("input");
  var buttons = index.parentElement.getElementsByTagName("button");

  if(index.parentElement.getElementsByTagName("h4")[0].innerText=="Password"){
    if(setting[0].value){
      displaySettings[0].innerText="";
      for(var i=0;i<setting[0].value.length;i++){
        displaySettings[0].innerText+='*';
      }
    }
  }else{
    for(var ds=0;ds<displaySettings.length;ds++){
      if(setting[ds].value){
        displaySettings[ds].innerText=setting[ds].value;
      }
    }
  }

  for(var s=0;s<setting.length;s++){
    setting[s].style.display="none";
  }
  buttons[0].style.display="block";
  buttons[1].style.display="none";
  buttons[2].style.display="none";
}

function accountCancel(index){
  var setting = index.parentElement.getElementsByTagName("input");
  var buttons = index.parentElement.getElementsByTagName("button");
  for(var i=0;i<setting.length;i++){
    setting[i].style.display="none";
  }
  buttons[0].style.display="block";
  buttons[1].style.display="none";
  buttons[2].style.display="none";
}

//Making Current Bookings modules
//  $("#currentBookings")
//    .append($("<div></div>")
//      .attr('class','modulecontainer')
//      //Cancel Booking Button
//      .append('<button class="removeBookingButton" onclick="remove(this)">X</button>')

//      //Image Module
//      .append($("<div class='divstyle imagemodule'></div>")
//        .append($("<img alt='Hotel' title='Your Hotel' class='boximage'>")
//          .attr('src','images/letoh1.jpg')//CONTENT
//        )
//      )
//      //description module
//      .append($("<div></div>")
//        .attr('class','divstyle descriptmodule')
//        .append($("<h3 class='hotelboxheadings'></h3>")
//          .text('Paradise Interchange Hotel')
//        )
//        .append('<h3 class="boxheadings">Location:</h3>')
//        .append($('<p class="boxparagraph"></p>')
//          .text("12 Jimmy Street")//Content
//        )
//        .append($('<p class="boxparagraph"></p>')
//          .text("Adelaide, South Australia")//Content
//        )
//        .append($('<p class="boxparagraph"></p>')
//          .text("Room 1: 2 Adults, 1 King bed")//Content
//        )
//
//        .append("<br>")
//        .append($('<h4 class="boxheadings">Your Booking Includes:</h4>'))
//        .append($('<ul class="boxparagraph"></ul>')
//          .append($('<li></li>')
//            .text("1 Bathroom")//CONTENT
//          )
//          .append($('<li></li>')
//            .text("Free Continental Breakfast")//CONTENT
//          )
//          .append($('<li></li>')
//            .text("Free Wifi")//CONTENT
//          )
//          .append($('<li></li>')
//            .text("Free Parking")//CONTENT
//          )
//        )
//        .append("<br>")
//        //Table
//        .append($('<table class="boxtable"></table>')
//          .append($('<tr></tr>')
//            .append('<td>Check-in:</td>')
//            .append($('<td class="tablerightcol tableFill"></td>')
//              .text("2018-05-15")//CONTENT
//            )
//          )
//          .append($('<tr></tr>')
//            .append('<td>Check-out:</td>')
//            .append($('<td class="tablerightcol tableFill"></td>')
//              .text("2018-05-19")//CONTENT
//            )
//          )
//          .append($('<tr></tr>')
//            .append('<td>Length of stay:</td>')
//            .append($('<td class="tablerightcol"></td>')
//              .text("4 days")//CONTENT
//            )
//          )
//          .append($('<tr></tr>')
//            .append($('<td></td>')
//              .text("4 days")//CONTENT
//            )
//            .append($('<td class="tablerightcol"></td>')
//              .text("AU $5000")//CONTENT
//            )
//          )
//          .append($('<tr></tr>')
//            .append('<td>Taxes</td>')
//            .append($('<td class="tablerightcol"></td>')
//              .text("AU $54000")//CONTENT
//            )
//          )
//          .append($('<tr></tr>')
//            .append('<th class="tabletotal">Total</th>')
//            .append($('<th class="tablerightcol"></th>')
//              .text("AU $59000")//CONTENT
//            )
//          )
//          .append('<button class="editBookingedit" onclick="editBookingedit(this)">Change</button>')
//          .append('<button class="confirmBookingedit" onclick="confirmBookingedit(this)">Confirm</button>')
//          .append('<button class="cancelBookingedit" onclick="cancelBookingedit(this)">Cancel</button>')
//        )//table end
//      )
//  );


	//	//Review Module
//	.append($("<div></div>")
//	  .attr('class','divstyle reviewmodule')
//	  .append($('<h3 class="hotelboxheadings">Your review</h3>'))
//	  .append($('<button class="reviewButton" onclick="reviewButton(this)">+</button>'))
//	  .append($('<button class="postButton" onclick="postButton(this)">Post</button>'))
//	  .append($('<button class="cancelButton" onclick="cancelButton(this)">Cancel</button>'))
//	)
