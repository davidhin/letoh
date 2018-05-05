var express = require('express');
var router = express.Router();

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
users['test'] = {'password': 'password'};

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

 // Read all users
fs.readFile('data/users.json', 'utf8', function(err, data) {
  users = JSON.parse(data);
});

router.get('/getUsers.json', function(req, res) {
  res.send(JSON.stringify(users));
});

// Read all bookings
fs.readFile('data/bookings.json', 'utf8', function(err, data) {
  bookings = JSON.parse(data);
});

// Send booking information to client
router.get('/getBookings.json', function(req, res) {
  res.send(JSON.stringify(bookings));
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
  let newHotel = {'id': newId, 'name': name, 'price': 0, 'rating': 1};
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
    return res.redirect('./logsign.html');
  }

  users[req.body.email] = {
    // 'id': userID,
    'firstName': req.body.firstname,
    'lastName': req.body.lastname,
    'password': req.body.password,
    'phoneNumber': 0,
    'address': 'asd',
  };

  console.log('Success!');
  console.log(users);
  return res.redirect('./logsign.html');
});

router.post('/login', function(req, res, next) {
  // If login details present, attempt login
  if (req.body.email !== undefined && req.body.password !== undefined) {

    for(let i=0;i<users.length;i++){
      //If email and password match user
      console.log("am i run");
      if(users[i].email===req.body.email && users[i].password===req.body.password){
        // Record user current session
        sessions[req.session.id] = req.body.email;
        console.log(req.session.id);
        console.log(sessions[req.session.id]);
        return res.redirect('/');
      //If loop reaches end and user not found
      }else if(i===(users.length-1)){
        console.log('Sign Up');
        return res.redirect('./logsign.html');
      }
    }

/*
    // If user does not exist, resend login page
    if (users[req.body.email] === undefined ) {
      console.log('Sign Up');
      return res.redirect('./logsign.html');

    // If user exists and password matches
    } else if (users[req.body.email].password === req.body.password) {
        // Record user current session
        sessions[req.session.id] = req.body.email;
        console.log(req.session.id);
        console.log(sessions[req.session.id]);
        return res.redirect('/');

    // All inputs incorrect, I think you can get rid of this field, cos if the user doesn't exist, that bit will run
    } else {
      console.log('incorrect input');
      return res.redirect('./logsign.html');
    }*/

  }else if (req.body.idtoken !== undefined) {// If logged in using Google
    console.log("Google token received");
    async function verify(token) {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: '586635191861-jr2ddas44f71pul4dc2su091lutgabsv.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log(payload);
      // for (let i = 0; i < users.length; i++) {
      //   if (users[i].google === userid) {
      //     sessions[req.session.id] = users[i].username;
      //     user = users[i].username;
      //   }
      // }
    }
  }else{//If there is no input
    return res.redirect('./logsign.html');
  }
});

// sessions work in progress
router.get('/session', function(req, res, next) {
  console.log('server');
  console.log(sessions);
  res.send(JSON.stringify([{'id': sessions[req.session.id]}]));
});

// =============================== UNUSED ============================== //
// Add hotel data to the file
// router.post('/addData', function(req, res) {
//   var added_hotel_str = JSON.stringify(req.body);
//   var added_hotel_obj = JSON.parse(added_hotel_str);
//
//   // Read hotel details into variable hotels
//   fs.readFile('data/hotel.json', 'utf8', function(err, data) {
//     hotels = JSON.parse(data);
//
//     // Push hotel
//     hotels.push(added_hotel_obj);
//     var main_details = JSON.stringify(hotels);
//     fs.writeFile('data/hotel.json', main_details, 'utf8', function(err) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log("hotel.json was saved!");
//     });
//   });
//
// });
//

module.exports = router;
