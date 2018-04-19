var express = require('express');
var router = express.Router();

var fs = require('fs');

var hotels = [];

// Send information to client
router.get('/hotel.json', function(req, res) {
  // Read hotel details into variable hotels
  fs.readFile('data/hotel.json', 'utf8', function(err, data) {
    hotels = JSON.parse(data);
    res.send(JSON.stringify(hotels));
  });
});

// Add hotel data to the file
router.post('/addData', function(req, res) {
  var added_hotel_str = JSON.stringify(req.body);
  var added_hotel_obj = JSON.parse(added_hotel_str);

  // Read hotel details into variable hotels
  fs.readFile('data/hotel.json', 'utf8', function(err, data) {
    hotels = JSON.parse(data);
 
    // Push hotel
    hotels.push(added_hotel_obj);
    var main_details = JSON.stringify(hotels);
    fs.writeFile('data/hotel.json', main_details, 'utf8', function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("hotel.json was saved!");
    });
  });
  
});


module.exports = router;
