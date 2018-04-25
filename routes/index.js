var express = require('express');
var router = express.Router();

var fs = require('fs');

// have ids
var hotels = [];
var users = [];

// linked to ids
var all_rooms = [];
var bookings = [];

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Read all rooms
fs.readFile('data/rooms.json', 'utf8', function(err, data) {
  all_rooms = JSON.parse(data);
});

// Read all users
fs.readFile('data/users.json', 'utf8', function(err, data) {
  users = JSON.parse(data);
});

// Get users
router.get('/users.json', function(req, res) {
  res.send(JSON.stringify(users));
});

// Send information to client
router.get('/getHotels.json', function(req, res) {
  res.send(JSON.stringify(hotels));
});

// Add hotel
router.post('/addHotel.json', function(req, res) {
  // Do individually so that people can't arbitrarily send data to server

  console.log(hotels.length);
  var newId = hotels[hotels.length-1].id + 1;
  var name = "New Hotel ID = " + newId;
  var newHotel = {'id':newId, 'name':name};
  hotels.push(newHotel);

  console.log(hotels);
  console.log(hotels[hotels.length-1]);
  res.send(newHotel);
});

// Updates hotel detail information
router.post('/changeHotelDetails.json', function(req, res) {
  var hotel = JSON.parse(req.body.hotel);

  var target_hotel = searchHotel(hotel.id);
  hotels[target_hotel][req.body.changed_detail] = hotel[req.body.changed_detail];

  res.send("");
});

// Update the hotel address
// Takes a JSON object of form {hotel address lat lng}
router.post('/updateHotelAddress.json', function(req, res) {
  var hotel = JSON.parse(req.body.hotel);
  var target_hotel = searchHotel(hotel.id);
  hotels[target_hotel]['address'] = req.body.address;
  hotels[target_hotel]['lat'] = req.body.lat;
  hotels[target_hotel]['lng'] = req.body.lng;
  res.send("");
});

// Delete a hotel from the database
router.post('/deleteHotel.json', function(req, res) {
  var target_hotel = searchHotel(req.body.id);
  hotels.splice(target_hotel, 1);
  console.log(hotels);
  res.send("");
});

var rooms;
// Get the rooms of a hotel by id
router.get('/getRooms.json', function(req, res) {
  rooms = [];
  var hotel_id = req.body.id;

  for (let i = 0; i < all_rooms.length; i++)
    if (all_rooms.id == hotel_id)
      rooms.push(rooms[i]);

  console.log(rooms);
  res.send(JSON.stringify(rooms));
});

function searchHotel(hotel_id) {
  for (let i = 0; i < hotels.length; i++)
    if (hotels[i].id == hotel_id)
      return i;
}

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
