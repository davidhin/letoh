var express = require('express');
var router = express.Router();

var fs = require('fs');

var hotels = [];

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Send information to client
router.get('/getHotels', function(req, res) {
  res.send(JSON.stringify(hotels));
});

router.post('/addHotel', function(req, res) {
  console.log(hotels);
  console.log(req.body);
  // Do individually so that people can't arbitrarily send data to server
  hotels.push({name: req.body.name, lat: req.body. lat, lng: req.body.lng});
  console.log(hotels);
  res.send();
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
