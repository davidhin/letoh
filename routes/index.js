var express = require('express');
var router = express.Router();

var fs = require('fs');

// have ids
var hotels = [];
var users = [];

// linked to ids
var allRooms = [];
var bookings = [];

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Read all rooms
fs.readFile('data/rooms.json', 'utf8', function(err, data) {
  allRooms = JSON.parse(data);
});

// Read all users
fs.readFile('data/users.json', 'utf8', function(err, data) {
  users = JSON.parse(data);
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

  console.log(hotels.length);
  let newId = hotels[hotels.length-1].id + 1;
  let name = 'New Hotel ID = ' + newId;
  let newHotel = {'id': newId, 'name': name, 'price': 0, 'rating': 1};
  hotels.push(newHotel);

  console.log(hotels);
  console.log(hotels[hotels.length-1]);
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
  console.log(hotels);
  res.send('');
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

  console.log(rooms);
  res.send(JSON.stringify(rooms));
});

// Add room
router.post('/addRoom.json', function(req, res) {
  let targetHotel = searchHotel(req.body.id);

  let calcroomid = hotels[targetHotel].roomtypes;
  hotels[targetHotel].roomtypes += 1;
  allRooms.push( {'id': req.body.id, 'name': calcroomid, 'price': 100, 'roomid': calcroomid} );
  console.log(allRooms);
  res.send('');
});

router.post('/changeRoomDetails.json', function(req, res) {
  let roomIndex = searchRoom(req.body.hotelid, req.body.roomid);
  allRooms[roomIndex].name = req.body.title;
  allRooms[roomIndex].desc = req.body.desc;
  allRooms[roomIndex].price = req.body.roomprice;
  console.log(roomIndex);
  console.log(req.body.hotelid, req.body.roomid);
  res.send('');
});

router.post('/newBooking.json', function(req, res) {
  bookings.push(req.body);
  console.log(req.body);
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

router.get('/getUsers.json', function(req, res) {
  res.send(JSON.stringify(users));
});

router.post('/signup',function(req,res,next){
//address and phone number not in sign up page
  let userID = users[users.length-1].id + 1;
  let newUser = {
    'id': userID,
    'firstName': req.body.firstname,
    'lastName': req.body.lastname,
    'email': req.body.email,
    'password': req.body.password,
    'phoneNumber':0,
    'address': "asd"
  };
  users.push(newUser);
  res.redirect("/");
});

router.post('/login',function(req, res, next){
  for(var i=0;i<users.length;i++){
    if(req.body.email==users[i].email && req.body.password==users[i].password){
      //sessions[req.session.id] = [req.body.username,req.body.password];
      //res.send();
      res.redirect('/');
    }else if(i===users.length-1){
      res.redirect('/logsign.html');
    }
  }
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
