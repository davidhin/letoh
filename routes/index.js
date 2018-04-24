var express = require('express');
var router = express.Router();

var fs = require('fs');

// have ids
var hotels = [];
var users = [];

// linked to ids
var rooms = [];
var bookings = [];

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Send information to client
router.get('/getHotels.json', function(req, res) {
  res.send(JSON.stringify(hotels));
});

// Add hotel
router.post('/addHotel.json', function(req, res) {
  // Do individually so that people can't arbitrarily send data to server

  var name = "New Hotel ID = " + hotels.length;
  var newHotel = {'ID':hotels.length, 'name':name};
  hotels.push(newHotel);
  res.send(newHotel);
  
  console.log(hotels);
  res.send();
});

router.post('/changeHotelDetails.json', function(req, res) {
  var hotel = JSON.parse(req.body.hotel);
  hotels[hotel.id][req.body.changed_detail] = hotel[req.body.changed_detail];
  console.log(hotels);
  res.send("");
});

// Add hotel data to the file
router.post('/addData', function(req, res) {
  var added_hotel_str = JSON.stringify(req.body);
  var added_hotel_obj = JSON.parse(added_hotel_str);

  console.log("hotel.json was saved!");
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
