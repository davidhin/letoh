var hotels = [];

// =========== MAIN FUNCTIONS ============== //


$(document).ready(function() {
  'use strict';
  requestHotels(function() {
    loadHotelSidebar();
    mgrOverview();
    sizes();
  });
});

/**
 * Updates the hotels array to server side array
 * @param {function} callback The callback function
 */
function requestHotels(callback) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      hotels = JSON.parse(xhttp.responseText);
      callback();
    }
  };

  xhttp.open('GET', 'getHotelSubset.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

// =========== LOAD CONTENT ============== //
/**
 * Hides the content. Called by other functions
 */
function hideContent() {
  'use strict';
  // Hide other cards
  $('#content').children('div').each(function() {
    $(this).hide();
  });
}

/**
 * @param {funcion} hotelInput Displays hotelInput's information
 */
function mgrInfo(hotelInput) {
  'use strict';
  // Current selected hotel

  // Get the information for the hotel corresponding to hotel_0
  // And display it in the hotel manager cards
  $('#generalInfo').empty();

  let titleContainer = $('<div/>')
    .css({
      'margin': '0 auto',
      'width': 'auto'
    })
    .appendTo('#generalInfo');
  $('<h1/>')
    .click(function() {
      btnEditText(titleContainer, this, this, hotelInput, 'name', 1, true,
        function() {
          requestHotels(function() {
            loadHotelSidebar();
          });
        });
    })
    .css('font-weight', '100').html(hotelInput.name).appendTo(titleContainer);

  // <div id="mgr_tags" class="mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col mdl-cell--3-col-tablet mdl-cell--1-phone">Tags</div>

  // mdl-grid container
  let infoContainer = $('<div/>').addClass('mdl-grid').appendTo('#generalInfo');
  $('<div/>')
    .attr('id', 'mgrAddress')
    .addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--12-col')
    .appendTo(infoContainer);
  let addressText = $('<p/>')
    .css('margin', '0').html(hotelInput.address).appendTo('#mgrAddress');
  $('<div/>')
    .attr('id', 'mgr_mainImage')
    .addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--3-col-desktop mdl-cell--3-col-tablet mdl-cell--4-phone')
    .html('Main Image').appendTo(infoContainer);
  $('<div/>')
    .attr('id', 'mgrDesc')
    .addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--9-col-desktop mdl-cell--5-col-tablet mdl-cell--4-phone').appendTo(infoContainer);
  let deleteHotel = $('<div/>').attr('id', 'mgr_delete').addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--12-col').appendTo(infoContainer);
  deleteHotel.css({
    'background': 'rgba(101,101,101)',
    'min-height': '0'
  });
  $('<button/>')
    .addClass('mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--secondary mdl-button--raised')
    .css({
      'width': '140px',
      'margin': '0 auto'
    })
    .html('DELETE HOTEL').appendTo('#mgrAddress')
    .click(function() {
      deleteHotelConfirm(deleteHotel, this, hotelInput);
    })
    .appendTo(deleteHotel);

  // Edit address button
  $('<button/>')
    .addClass('editButton mdl-button mdl-js-button mdl-button--primary')
    .html('edit').appendTo('#mgrAddress')
    .click(function() {
      editAddress($('#mgrAddress'), this, addressText, hotelInput);
    });

  // mgr desc header
  $('<h4/>').html('Description').appendTo('#mgrDesc');
  let mgrDescContent = $('<p/>').html(hotelInput.desc).appendTo('#mgrDesc');
  // mgr desc button
  $('<button/>')
    .addClass('editButton mdl-button mdl-js-button mdl-button--primary')
    .html('edit').appendTo('#mgrDesc')
    .click(function() {
      btnEditText('#mgrDesc', this, mgrDescContent, hotelInput, 'desc', 6, false, function() {});
    });

  // Show current card
  hideContent();
  $('#generalInfo').show();
  sizes();
}

/**
 * confirms whether the user wants to delete the hotel
 * @param {domelement} div The container div for delete button
 * @param {button} input The button that initiates the confirmation
 * @param {object} hotel The actual hotel to be deleted
 */
function deleteHotelConfirm(div, input, hotel) {
  $(input).hide();
  $(div).animate({
    backgroundColor: 'rgb(131,26,26)'
  }, 200);

  let textConf = $('<p/>')
    .css({
      'margin': '0',
      'color': 'white'
    })
    .html('Are you SURE you want to delete this hotel? (no undo)')
    .appendTo($(div));

  let buttonArea = $('<div/>')
    .css('text-align', 'right')
    .addClass('mdl-card__actions')
    .appendTo(div);

  // Delete button
  $('<button/>')
    .addClass('mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--secondary mdl-button--raised')
    .css({
      'width': '140px',
      'margin-right': '10px'
    })
    .html('DELETE').appendTo(buttonArea)
    .click(function() {
      // Delete hotel from the database
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // Display overview
          $('#generalInfo').fadeOut(function() {
            loadHotelSidebar();
            mgrOverview();
          });
        }
      };
      xhttp.open('POST', 'deleteHotel.json', true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(JSON.stringify(hotel));
    });

  // Cancel button
  $('<button/>')
    .addClass('mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--secondary mdl-button--raised')
    .css({
      'width': '140px',
      'margin': '0 auto'
    })
    .html('CANCEL').appendTo(buttonArea)
    .click(function() {
      $(input).show();
      $(div).animate({
        backgroundColor: 'rgb(101,101,101)'
      }, 200);
      $(textConf).remove();
      buttonArea.remove();
    });
}

/**
 * Shows the rooms for the input hotel
 * @param {hotelobject} hotelInput The input hotel to show rooms
 */
function mgrRoom(hotelInput) {
  'use strict';

  // Request rooms from server
  let rooms = [];
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      rooms = JSON.parse(xhttp.responseText);
      // Current selected hotel
      const roomTypes = rooms.length;
      // Get the types of rooms for this hotel and information
      $('#roomTypes').empty();
      // Hotel name title
      let titleContainer = $('<div/>').css('margin', '0 auto').appendTo('#roomTypes');
      $('<h1/>')
        .click(function() {
          btnEditText(titleContainer, this, this, hotelInput, 'name', 1, true, function() {
            loadHotelSidebar();
          });
        })
        .css('font-weight', '100').html(hotelInput.name).appendTo(titleContainer);
      // Room loop to display data
      for (let i = 0; i < roomTypes; i++) {
        let roomRow = $('<div/>').addClass('mdl-grid').appendTo('#roomTypes');
        // room info
        $('<div/>')
          .addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--4-col mdl-cell--3-col-tablet mdl-cell--1-col-phone')
          .appendTo(roomRow);
        let roomDesc = $('<div/>')
          .addClass('mdl-cell mdl-card mdl-shadow--2dp mdl-cell--8-col mdl-cell--5-col-tablet mdl-cell--1-col-phone')
          .appendTo(roomRow);
        /* --- DYNAMIC --- */
        // room desc header
        let roomName = $('<h4/>').html(rooms[i].name).appendTo(roomDesc);
        let priceDiv = $('<div/>').appendTo(roomDesc);
        $('<p/>').css('display', 'inline-block').html('$').appendTo(priceDiv);
        let roomPrice = $('<p/>').css('display', 'inline-block').html(rooms[i].price).appendTo(priceDiv);
        // roomDesc_content
        let roomDescP = $('<p/>').html(rooms[i].desc).appendTo(roomDesc);
        // roomDesc_editBtn
        $('<button/>')
          .addClass('editButton mdl-button mdl-js-button mdl-button--primary')
          .html('edit').appendTo(roomDesc)
          .click(function() {
            editRoomDesc(roomDesc, this, roomName, roomPrice, roomDescP, hotelInput, rooms[i]);
          });
      }

      // "Add a room" button
      let addButton = $('<button/>')
        .addClass('addButton mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored')
        .appendTo('#roomTypes')
        .click(function() {
          addHotelRoom(hotelInput);
        });
      $('<i/>').addClass('material-icons').html('add').appendTo(addButton);
      // Show current card
      hideContent();
      $('#roomTypes').show();
      sizes();
    }
  };
  xhttp.open('POST', 'getRooms.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotelInput));
}

/**
 * Function to add a hotel room
 * @param {hotelObject} hotelInput The relevant hotel
 */
function addHotelRoom(hotelInput) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mgrRoom(hotelInput);
    }
  };
  xhttp.open('POST', 'addRoom.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send(JSON.stringify(hotelInput));
}

/**
 * This function replaces the content with the hotel manager overview screen
 */
function mgrOverview() {
  'use strict';

  requestHotels(function() {
    $('#hotelOverview').empty();
    let overviewGrid = $('<div/>').addClass('mdl-grid').appendTo('#hotelOverview');
    for (let i = 0; i < hotels.length; i++) {
      let mgrOverviewCard = $('<div/>')
        .addClass('mgrOverviewCard mdl-cell mdl-card mdl-shadow--2dp mdl-cell--6-col-desktop mdl-cell--12-col')
        .appendTo(overviewGrid);
      $('<h2/>')
        .css('margin', 0)
        .html(hotels[i].name)
        .appendTo(mgrOverviewCard);
      $('<p/>')
        .css({
          'color': 'rgb(0,102,116)',
          'margin': '0'
        })
        .html(hotels[i].address)
        .appendTo(mgrOverviewCard);
      $('<p/>')
        .css({
          'color': 'rgb(180,180,180)',
          'margin': '0'
        })
        .html(hotels[i].lat + ' ' + hotels[i].lng)
        .appendTo(mgrOverviewCard);
      $('<p/>')
        .css('margin', 0)
        .html(hotels[i].desc)
        .appendTo(mgrOverviewCard);
    }

    mdl_upgrade();

    let addButton = $('<button/>')
      .addClass('newHotelButton addButton mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored')
      .click(function() {
        addHotelButton();
      })
      .appendTo('#hotelOverview');
    $('<i/>').addClass('material-icons').html('add').appendTo(addButton);
    mdl_upgrade();

    hideContent();
    $('#hotelOverview').show();

    sizes();
  });
}

/**
 * This function controls the adding of a new hotel
 */
function addHotelButton() {
  let xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mgrOverview();
      loadHotelSidebar();
    }
  };

  xhttp.open('POST', 'addHotel.json', true);
  xhttp.setRequestHeader('Content-type', 'application/json');
  xhttp.send();
}

/**
 * This function is for the editing of a hotel address
 * @param {div} container Container of the address
 * @param {button} editBtn Button clicked to enable editing
 * @param {p} contentIn The <p> containing the address
 * @param {hotelobject} hotel The relevant hotel
 */
function editAddress(container, editBtn, contentIn, hotel) {
  'use strict';
  $(editBtn).hide();
  $(contentIn).hide();
  let divTextarea = $('<div/>')
    .css('width', '100%')
    .addClass('mdl-textfield mdl-js-textfield')
    .appendTo(container);
  let inputTextarea = $('<input/>')
    .addClass('mdl-textfield__input')
    .attr({
      'id': 'place_search',
      'type': 'text'
    })
    /* --- DYNAMIC --- */
    .val($(contentIn).html())
    .appendTo(divTextarea);

  // Autocomplete place and send details to server
  let input = document.getElementById('place_search');
  let autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No details available for input: "' + place.name + '"');
      return;
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'updateHotelAddress.json', true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify({
      'hotel': JSON.stringify(hotel),
      'address': place.name,
      'lat': place.geometry.location.lat(),
      'lng': place.geometry.location.lng(),
    }));
  });

  // label_line
  $('<label/>')
    .addClass('mdl-textfield__label')
    .appendTo(divTextarea);
  let buttonArea = $('<div/>')
    .css('padding', '15px 0 0 0')
    .css('text-align', 'right')
    .addClass('mdl-card__actions')
    .appendTo(container);
  // submitButton
  $('<a/>').html('submit').addClass('lowButton mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent')
    .appendTo(buttonArea)
    .click(function() {
      /* --- DYNAMIC --- */
      $(contentIn).html(inputTextarea.val());
      $(contentIn).show();
      $(editBtn).show();
      inputTextarea.remove();
      divTextarea.remove();
      buttonArea.remove();
    });
  // cancelButton
  $('<a/>').html('cancel').addClass('lowButton mdl-button mdl-js-button')
    .appendTo(buttonArea)
    .click(function() {
      $(contentIn).show();
      $(editBtn).show();
      inputTextarea.remove();
      divTextarea.remove();
      buttonArea.remove();
    });
  mdl_upgrade();
}


/**
 * This function controls the editing of a room
 * @param {div} container Container of the room card
 * @param {button} editBtn Button clicked to enable editing
 * @param {h2} titleIn The <h2> containing the room type name
 * @param {p} priceIn The <p> containing the room description
 * @param {p} contentIn The <p> containing the room description
 * @param {hotelobject} hotel The relevant hotel
 * @param {array} hotelRooms The relevant rooms for the hotel
 */
function editRoomDesc(container, editBtn, titleIn, priceIn, contentIn, hotel, hotelRooms) {
  'use strict';
  $(editBtn).addClass('orig').hide();
  $(titleIn).addClass('orig').hide();
  $(priceIn).addClass('orig').hide();
  $(priceIn).siblings().addClass('orig').hide();
  $(contentIn).addClass('orig').hide();

  // Edit room name
  let divTitlearea = $('<div/>')
    .css('width', '100%')
    .addClass('temp mdl-textfield mdl-js-textfield')
    .appendTo(container);
  let inputTitlearea = $('<input/>')
    .addClass('temp mdl-textfield__input')
    .attr({
      'type': 'text',
      'id': 'title_desc'
    })
    .css({
      'font-size': '24px'
    })
    /* --- DYNAMIC --- */
    .val($(titleIn).html())
    .appendTo(divTitlearea);
  // label_line
  $('<label/>')
    .addClass('mdl-textfield__label')
    .appendTo(divTitlearea);

  // Edit room price
  let divPricearea = $('<div/>')
    .css('width', '100%')
    .addClass('temp mdl-textfield mdl-js-textfield')
    .appendTo(container);
  let inputPricearea = $('<input/>')
    .addClass('temp mdl-textfield__input')
    .attr({
      'type': 'number',
      'id': 'price_desc'
    })
    /* --- DYNAMIC --- */
    .val($(priceIn).html())
    .appendTo(divPricearea);
  // label_line
  $('<label/>')
    .addClass('mdl-textfield__label')
    .appendTo(divPricearea);

  // Edit room description
  let divTextarea = $('<div/>')
    .css('width', '100%')
    .addClass('temp mdl-textfield mdl-js-textfield')
    .appendTo(container);
  let inputTextarea = $('<textarea/>')
    .addClass('temp mdl-textfield__input')
    .attr({
      'type': 'text',
      'id': 'room_desc',
      'rows': 4
    })
    .css({
      'resize': 'none'
    })
    /* --- DYNAMIC --- */
    .val($(contentIn).html())
    .appendTo(divTextarea);
  // label_line
  $('<label/>')
    .addClass('mdl-textfield__label')
    .appendTo(divTextarea);

  let buttonArea = $('<div/>')
    .css('padding', '15px 0 0 0')
    .css('text-align', 'right')
    .addClass('temp mdl-card__actions')
    .appendTo(container);
  // submitButton
  $('<a/>').html('submit').addClass('lowButton mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent')
    .appendTo(buttonArea)
    .click(function() {
      if ($.isNumeric(inputPricearea.val())) {
        /* --- DYNAMIC --- */
        $(contentIn).html(inputTextarea.val());
        $(titleIn).html(inputTitlearea.val());
        $(priceIn).html(inputPricearea.val());
        $('.orig').show();
        $('.temp').remove();

        // Send data to server
        let xhttp = new XMLHttpRequest();
        xhttp.open('POST', 'changeRoomDetails.json', true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify({
          'hotelid': hotel.id,
          'roomprice': inputPricearea.val(),
          'roomid': hotelRooms.roomid,
          'desc': inputTextarea.val(),
          'title': inputTitlearea.val()
        }));
      }
    });
  // cancelButton
  $('<a/>').html('cancel').addClass('lowButton mdl-button mdl-js-button')
    .appendTo(buttonArea)
    .click(function() {
      $('.orig').show();
      $('.temp').remove();
    });
  mdl_upgrade();
}

// =================== GENERALISED IMPORTANT STUFF ========================= //


/**
 * Edit a text field and submit it
 * @param {div} container The container which contains editBtn, content
 * @param {button} editBtn The button that must be pressed to edit contentIn
 * @param {p} contentIn The paragraph containing the content
 * @param {hotelObject} hotel The input hotel object
 * @param {string} type The type of hotel attribute to be modified e.g. 'desc'
 * @param {num} rows The number of rows for the textfield
 * @param {bool} bigText Whether the textfield should be for a title
 * @param {function} callback The callback function that runs after server is updated
 */
function btnEditText(container, editBtn, contentIn, hotel, type, rows, bigText, callback) {
  'use strict';
  $(editBtn).hide();
  $(contentIn).hide();
  let divTextarea = $('<div/>')
    .css('width', '100%')
    .addClass('temp mdl-textfield mdl-js-textfield')
    .appendTo(container);
  let inputTextarea = $('<textarea/>')
    .addClass('temp mdl-textfield__input')
    .attr({
      'type': 'text',
      'id': 'text_desc',
      'rows': rows
    })
    .css({
      'resize': 'none'
    })
    /* --- DYNAMIC --- */
    .val($(contentIn).html())
    .appendTo(divTextarea);
  // label_line
  $('<label/>')
    .addClass('mdl-textfield__label')
    .appendTo(divTextarea);

  let buttonArea = $('<div/>')
    .css('padding', '15px 0 0 0')
    .css('text-align', 'right')
    .addClass('temp mdl-card__actions')
    .appendTo(container);
  // submitButton
  $('<a/>')
    .html('submit')
    .addClass('lowButton mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect mdl-button--accent')
    .appendTo(buttonArea)
    .click(function() {
      // If input is empty -> cancel
      if (!inputTextarea.val()) {
        $(contentIn).show();
        $(editBtn).show();
        $('.temp').remove();
        return;
      }

      // Update client side hotel array
      $(contentIn).html(inputTextarea.val());
      hotel[type] = inputTextarea.val();

      // Send data to server
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          callback();
        }
      };
      xhttp.open('POST', 'changeHotelDetails.json', true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.send(JSON.stringify({
        'hotel': JSON.stringify(hotel),
        'changed_detail': type
      }));

      // Reshow and delete appropriate elements
      $(contentIn).show();
      $(editBtn).show();
      $('.temp').remove();
    });
  // cancelButton
  $('<a/>')
    .html('cancel')
    .addClass('lowButton mdl-button mdl-js-button')
    .appendTo(buttonArea)
    .click(function() {
      $(contentIn).show();
      $(editBtn).show();
      $('.temp').remove();
    });

  if (bigText) {
    inputTextarea.css({
      'font-size': '56px',
      'text-align': 'center'
    });
    inputTextarea.closest('div').css('width', 'auto');
    buttonArea.css({
      'text-align': 'center',
      'padding': 0
    });
  }

  mdl_upgrade();
}

// =========== LOAD SIDEBAR ============== //
/**
 * Updates the hotels array and loads the sidebar content
 */
function loadHotelSidebar() {
  'use strict';

  requestHotels(function() {
    $('#myHotels').empty();

    // Overview Button
    $('<button/>')
      .attr('id', 'overview')
      .click(function() {
        mgrOverview();
        sizes();
      })
      .addClass('mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary')
      .html('Dashboard')
      .appendTo('#myHotels');

    for (let i = 0; i < hotels.length; i++) {
      $('<button/>')
        .text(hotels[i].name)
        .addClass('mdl-button mdl-js-button mdl-js-ripple-effect accordion')
        .css('text-transform', 'none')
        .appendTo('#myHotels');
      const currId = 'myHotel_' + i;
      $('<div/>').attr('id', currId).addClass('panel').appendTo('#myHotels');
      $('<a/>')
        .click(function() {
          mgrInfo(hotels[i]);
          mdl_upgrade();
        })
        .html('General Info')
        .addClass('mdl-navigation__link')
        .appendTo('#' + currId);
      $('<a/>')
        .click(function() {
          mgrRoom(hotels[i]);
          mdl_upgrade();
        })
        .html('Room Types')
        .addClass('mdl-navigation__link')
        .appendTo('#' + currId);
      //  $('<a/>').click(function() { alert('foo2'); }).html('Reviews').addClass('mdl-navigation__link').appendTo('#' + currId);
      //  $('<a/>').click(function() { alert('bar2'); }).html('Special Offer').addClass('mdl-navigation__link').appendTo('#' + currId);
    }

    // ------------- ACCORDIAN ------------ //
    let acc = document.getElementsByClassName('accordion');
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function() {
        this.classList.toggle('active');
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  });
}
