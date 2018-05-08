var express = require('express');
var router = express.Router();

var CLIENT_ID = '586635191861-jr2ddas44f71pul4dc2su091lutgabsv.apps.googleusercontent.com';
var {OAuth2Client} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);
var gticket;

var fs = require('fs');

// have ids
var hotels = [];

// linked to ids
var allRooms = [];
var bookings = [];
var allReviews = [];

// login functionality
var users = {};
var sessions = {};
users['test'] = {'email': 'test', 'firstName': 'Test','lastName': 'tesT','address': '9 st','phoneNumber': '900','password': 'password', 'manageracc': 0};
users['admin'] = {'email': 'admin', 'firstName': 'Admin','lastName': 'Manager','address': '9 st','phoneNumber': '900','password': 'admin', 'manageracc': 1};
users['manager'] = {'email': 'manager', 'firstName': 'Admin','lastName': 'Manager','address': '9 st','phoneNumber': '900','password': 'manager', 'manageracc': 1};

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Read all rooms
fs.readFile('data/rooms.json', 'utf8', function(err, data) {
  allRooms = JSON.parse(data);
});

fs.readFile('data/reviews.json', 'utf8', function(err, data) {
  allReviews = JSON.parse(data);
});
/*
 // Read all users
fs.readFile('data/users.json', 'utf8', function(err, data) {
  users = JSON.parse(data);
});
*/
router.get('/getUsers.json', function(req, res) {
  res.send(JSON.stringify(users));
});

// Read all bookings
fs.readFile('data/bookings.json', 'utf8', function(err, data) {
  bookings = JSON.parse(data);
});

router.post('/reviewstuff.json', function(req, res, next) {
  let theBooking = {"refnum":0};
  for(let i=0;i<bookings.length;i++){
    if(bookings[i].refnum==req.body.refnum){
      theBooking = bookings[i];
    }
  }
  let hotelid = theBooking.hotelid;
  let roomid = theBooking.roomid;

  for(let k=0;k<allReviews.length;k++){
    if(allReviews[k].id===hotelid && allReviews[k].roomid===roomid && allReviews[k].email==sessions[req.session.id]){
      res.send(JSON.stringify(allReviews[k]));
    }else if(k==allReviews.length-1){
      res.send(JSON.stringify({"id":-1}));
    }
  }

});

// Send booking information to client
router.get('/getBookings.json', function(req, res) {
  let bookingSubset = [];
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].userid == sessions[req.session.id]) {
      bookingSubset.push(bookings[i]);
    }
  }
  res.send(bookingSubset);
});

// Send information to client
router.get('/hotelManage.html', function(req, res) {
  if (sessions[req.session.id] == null) {
    return res.send({'login': 0});
  } else if (sessions[req.session.id].manageracc == 0) {
    return res.send({'login': 0});
  } else {
    res.send(users[sessions[req.session.id]]);
  }
});

router.get('/getHotelSubset.json', function(req, res) {
  let hotelSubset = [];
  for (let i = 0; i < hotels.length; i++) {
    if (sessions[req.session.id] == hotels[i].owner) {
      hotelSubset.push(hotels[i]);
    }
  }
  res.send(JSON.stringify(hotelSubset));
});

// Send information to client
router.get('/getHotels.json', function(req, res) {
  res.send(JSON.stringify(hotels));
});

// Add hotel
router.post('/addHotel.json', function(req, res) {
  // Do individually so that people can't arbitrarily send data to server

  let newId = hotels[hotels.length-1].id + 1;
  let name = 'New Hotel ID = ' + newId;
  let newHotel = {'id': newId, 'owner': sessions[req.session.id], 'name': name, 'price': 0, 'rating': 1};
  hotels.push(newHotel);

  res.send(newHotel);
});

// Updates hotel detail information
router.post('/changeHotelDetails.json', function(req, res) {
  let hotel = JSON.parse(req.body.hotel);

  let targetHotel = searchHotel(hotel.id);
  hotels[targetHotel][req.body.changed_detail] = hotel[req.body.changed_detail];

  res.send('');
});

// Update the hotel address
// Takes a JSON object of form {hotel address lat lng}
router.post('/updateHotelAddress.json', function(req, res) {
  let hotel = JSON.parse(req.body.hotel);
  let targetHotel = searchHotel(hotel.id);
  hotels[targetHotel]['address'] = req.body.address;
  hotels[targetHotel]['lat'] = req.body.lat;
  hotels[targetHotel]['lng'] = req.body.lng;
  res.send('');
});

// Delete a hotel from the database
router.post('/deleteHotel.json', function(req, res) {
  let targetHotel = searchHotel(req.body.id);
  hotels.splice(targetHotel, 1);

  res.send('');
});

let reviews = [];
router.post('/getReviews.json', function(req, res) {
  reviews = [];
  let hotelID = req.body.id;

  for (let i = 0; i < allReviews.length; i++) {
    if (allReviews[i].id == hotelID) {
      reviews.push(allReviews[i]);
    }
  }

  res.send(JSON.stringify(reviews));
});

router.post('/addReview',function(req,res){
  let newReview ={
    "id":req.body.id,
    "roomid": req.body.roomid,
    "name":req.body.name,
    "email":req.body.email,
    "stars":req.body.stars,
    "review":req.body.review
  };

  allReviews.push(newReview);

  res.send("");
});

let rooms = [];
// Get the rooms of a hotel by id
router.post('/getRooms.json', function(req, res) {
  rooms = [];
  let hotelID = req.body.id;

  for (let i = 0; i < allRooms.length; i++) {
    if (allRooms[i].id == hotelID) {
      rooms.push(allRooms[i]);
    }
  }

  res.send(JSON.stringify(rooms));
});

// Add room
router.post('/addRoom.json', function(req, res) {
  let targetHotel = searchHotel(req.body.id);

  let calcroomid = hotels[targetHotel].roomtypes;
  hotels[targetHotel].roomtypes += 1;
  allRooms.push( {'id': req.body.id, 'name': calcroomid, 'price': 100, 'roomid': calcroomid} );

  res.send('');
});

router.post('/changeRoomDetails.json', function(req, res) {
  let roomIndex = searchRoom(req.body.hotelid, req.body.roomid);
  allRooms[roomIndex].name = req.body.title;
  allRooms[roomIndex].desc = req.body.desc;
  allRooms[roomIndex].price = req.body.roomprice;

  res.send('');
});

router.post('/newBooking.json', function(req, res) {
  bookings.push(req.body);

  res.send(req.body);
});

/**
 * Search for the hotel using a loop
 * @param {num} hotelID Search for hotel using its ID
 * @return {num} i Function returns the hotel's index in hotels[]
 */
function searchHotel(hotelID) {
  for (let i = 0; i < hotels.length; i++) {
    if (hotels[i].id == hotelID) {
      return i;
    }
  }
}

/**
 * Search for the hotel using a loop
 * @param {num} hotelID Search for hotel using its ID
 * @param {num} roomID Search for room using its roomID
 * @return {num} i Function returns the hotel's index in hotels[]
 */
function searchRoom(hotelID, roomID) {
  for (let i = 0; i < allRooms.length; i++) {
    if (allRooms[i].id == hotelID && allRooms[i].roomid == roomID) {
      return i;
    }
  }
}

router.post('/signup', function(req, res, next) {
// address and phone number not in sign up page
  if (users[req.body.email] != null) {
    console.log('Email already registered!');
    return res.send({'code': 0, 'message': 'Email is already registered'});
  }

  users[req.body.email] = {
    // 'id': userID,
    'firstName': req.body.firstname,
    'lastName': req.body.lastname,
    'password': req.body.password,
    'phoneNumber': 0,
    'address': 'asd',
    'manager-acc': req.body.hotelowner,
  };

  console.log('Success!');
  console.log(users);
  return res.send({'code': 1, 'message': 'User registered!'});
});

router.post('/login', function(req, res, next) {
  // If login details present, attempt login
  if (req.body.email !== undefined && req.body.password !== undefined) {
    // David's smart thing
    // If user does not exist, resend login page
    if (users[req.body.email] === undefined ) {
      return res.send({'login': 0});
    // If user exists and password matches
    } else if (users[req.body.email].password === req.body.password) {
      // Record user current session
      sessions[req.session.id] = req.body.email;
      return res.send({'login': 1});
    // All inputs incorrect, I think you can get rid of this field, cos if the user doesn't exist, that bit will run
    } else {
      console.log('incorrect input');
      return res.send({'login': 0});
    }

  // If logged in using google
  } else if (req.body.idtoken !== undefined) {
      console.log('Google token received');
      verify(req.body.idtoken, req).catch(console.error);
  } else { // If there is no input
  return res.redirect('./logsign.html');
  }
});

/**
 * Verify google login and set up account if not registered,
 * or simply login
 * @param {string} token The userid
 */
async function verify(token, req) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const email = payload['email'];
  if (users[email] == null) {
   users[email] = {
     'firstName': req.body.firstname,
     'lastName': req.body.lastname,
     'email': email,
     'google': userid,
     'phoneNumber': 0,
     'address': 'asd',
   };
  }
  sessions[req.session.id] = email;
  console.log(req.session.id);
  console.log(sessions[req.session.id]);
}

// Return user id (email) for the current session
router.get('/usersession.json', function(req, res, next) {
  if (sessions[req.session.id] == null) {
    return res.send({'login': 0});
  } else {
    res.send(users[sessions[req.session.id]]);
  }
});

router.get('/managersession.json', function(req, res, next) {
  if (users[sessions[req.session.id]].manageracc != 1) {
    return res.send({'login': 0});
  } else {
    res.send(users[sessions[req.session.id]]);
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      return res.redirect('/');
    }
  });
});

module.exports = router;
