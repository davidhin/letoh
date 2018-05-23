var express = require('express');
var router = express.Router();

var CLIENT_ID = '586635191861-jr2ddas44f71pul4dc2su091lutgabsv.apps.googleusercontent.com';
var {
  OAuth2Client
} = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);
var gticket;

var fs = require('fs');
// have ids
var hotels = [];

// linked to ids
var bookings = [];
var allReviews = [];

// login functionality
var users = {};
var sessions = {};

// Database Testing
router.get('/dbtest.json', function(req, res, next) {
  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;
    var query = "SELECT * from users";
    connection.query(query, function(err, results) {
      /* Some actions to handle the query results */
      res.json(results); // send response
    });
  });
});

users['test'] = {
  'email': 'test',
  'firstName': 'Test',
  'lastName': 'tesT',
  'address': '9 st',
  'phoneNumber': '900',
  'password': 'password',
  'manageracc': 0
};
users['admin'] = {
  'email': 'admin',
  'firstName': 'Admin',
  'lastName': 'Manager',
  'address': '9 st',
  'phoneNumber': '900',
  'password': 'admin',
  'manageracc': 1
};
users['manager'] = {
  'email': 'manager',
  'firstName': 'Admin',
  'lastName': 'Manager',
  'address': '9 st',
  'phoneNumber': '900',
  'password': 'manager',
  'manageracc': 1
};

// Read hotel details into variable hotels
fs.readFile('data/hotels.json', 'utf8', function(err, data) {
  hotels = JSON.parse(data);
});

// Read all rooms
fs.readFile('data/reviews.json', 'utf8', function(err, data) {
  allReviews = JSON.parse(data);
});

// Read all bookings
fs.readFile('data/bookings.json', 'utf8', function(err, data) {
  bookings = JSON.parse(data);
});

router.post('/changeUserDetail', function(req, res) {
  if (req.body.firstName != undefined) {
    users[sessions[req.session.id]].firstName = req.body.firstName;
    users[sessions[req.session.id]].lastName = req.body.lastName;
  } else if (req.body.address != undefined) {
    users[sessions[req.session.id]].address = req.body.address;
  } else if (req.body.phoneNumber != undefined) {
    users[sessions[req.session.id]].phoneNumber = req.body.phoneNumber;
  } else if (req.body.email != undefined) {
    users[sessions[req.session.id]].email = req.body.email;
  } else if (req.body.password != undefined) {
    users[sessions[req.session.id]].password = req.body.password;
  }

  res.send();
});

// Getting a review for a user's booking - Used in the account page
router.post('/reviewstuff.json', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select reviews.ref_num, reviews.review, reviews.room_id, reviews.stars " +
      "from reviews inner join users " +
      "on reviews.user_id = users.user_id " +
      "where reviews.ref_num = " + req.body.refnum;
    connection.query(query, function(err, results) {
      connection.release();
      if (results == undefined) {
        res.send(JSON.stringify({
          "id": -1,
        }));
      } else {
        res.send(JSON.stringify(results[0]));
      }

    });
  });

});

// Send booking information to client
router.get('/getBookings.json', function(req, res) {

  req.pool.getConnection(function(err,connection){
      if(err){throw err;}
      var query = "select bookings.*, hotels.name, hotels.address, hotels.hotel_id, rooms.name as roomname, datediff(bookings.check_out,bookings.check_in)*rooms.price as cost from bookings "+
      "inner join rooms on bookings.room_id = rooms.room_id "+
      "inner join hotels on rooms.hotel_id = hotels.hotel_id "+
      "where bookings.user_id = "+sessions[req.session.id].user_id+";";
      connection.query(query, function(err, results){
          connection.release();
          res.send(JSON.stringify(results));

      });
  });

});

router.get('/getHotelSubset.json', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    if (sessions[req.session.id] == null) {
      return res.status(403).send();
    }

    let query = 'select * from hotels where user_id = ' + sessions[req.session.id].user_id + ';';
    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });
});

// Send information to client
router.get('/getHotels.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select hotels.*, (min(rooms.price)) as price, ceiling(avg(reviews.stars)) as rating from hotels " +
      "left join rooms on hotels.hotel_id = rooms.hotel_id " +
      "left join reviews on rooms.room_id = reviews.room_id " +
      "group by hotels.hotel_id";

    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });
  //res.send(JSON.stringify(hotels));
});

// Add hotel
router.post('/addHotel.json', function(req, res) {
  // Do individually so that people can't arbitrarily send data to server

  let newId = hotels[hotels.length - 1].id + 1;
  let name = 'New Hotel ID = ' + newId;
  let newHotel = {
    'id': newId,
    'owner': sessions[req.session.id],
    'name': name,
    'price': 0,
    'rating': 6
  };
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

  // TODO Database it
  // let query = 'UPDATE hotels set user_id = 2 where name="Special hotel";';

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

//Gets all the reviews for a certain room
let reviews = [];
router.post('/getReviews.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select users.user_id, reviews.room_id, reviews.ref_num, users.name_first, users.name_last, users.email, reviews.stars, reviews.review " +
      "from reviews inner join users on reviews.user_id = users.user_id " +
      "inner join rooms on reviews.room_id = rooms.room_id " +
      "where rooms.hotel_id = " + req.body.hotel_id;
    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });
});

router.post('/addReview', function(req, res) {
  let newReview = {
    "id": req.body.id,
    "roomid": req.body.roomid,
    "refnum": req.body.refnum,
    "name": req.body.name,
    "email": req.body.email,
    "stars": req.body.stars,
    "review": req.body.review
  };

  allReviews.push(newReview);

//The following code may not be necessary
  //Room rating
  /*let roomIndex = searchRoom(req.body.id, req.body.roomid);

  let rating = 0;
  let counter = 0;
  for (let i = 0; i < allReviews.length; i++) {
    if (allReviews[i].id == req.body.id && allReviews[i].roomid == req.body.roomid) {
      rating += parseInt(allReviews[i].stars);
      counter++;
    }
  }
  rating = rating / counter;
  allRooms[roomIndex].stars = parseInt(rating);

  let hRating = 0;
  counter = 0;
  for (let i = 0; i < allRooms.length; i++) {
    if (allRooms[i].id == req.body.id) {
      hRating += parseInt(allRooms[i].stars);
      counter++;
    }
  }
  hRating = hRating / counter;
  let hotel = searchHotel(req.body.id);
  hotels[hotel].rating = parseInt(hRating);

  res.send("");*/
});

let rooms = [];
// Get the rooms of a hotel by id
router.post('/getRooms.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select rooms.*, ifnull((avg(reviews.stars)),6) as stars " +
      "from rooms inner join reviews on rooms.room_id = reviews.room_id " +
      "where rooms.hotel_id =" + req.body.hotel_id +
      " group by rooms.room_id";

    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });

});

// Add room
router.post('/addRoom.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "insert into rooms values(default,?,'Name',100,1,default);"+
    "update hotels set room_types = room_types + 1 "+
    "where hotel_id = ?;";

    connection.query(query, [hotel_id, hotel_id], function(err, results) {
      connection.release();
      res.send('');
    });
  });

});

router.post('/changeRoomDetails.json', function(req, res) {
  let roomIndex = searchRoom(req.body.hotelid, req.body.roomid);
  allRooms[roomIndex].name = req.body.title;
  allRooms[roomIndex].desc = req.body.desc;
  allRooms[roomIndex].price = req.body.roomprice;

  let hotel = searchHotel(req.body.hotelid);
  let min = hotels[hotel].price;

  for (let i = 0; i < allRooms.length; i++) {
    if (allRooms[i].id == req.body.hotelid && allRooms[i].price <= min) {

      min = allRooms[i].price;
    }
  }

  hotels[hotel].price = min;

  res.send('');
});

router.post('/newBooking.json', function(req, res) {
  // TODO - Push the booking request appropriately
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
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    let query = `select * from users where email='${req.body.email}';`;
    connection.query(query, function(err, results) {
      // If user exists return error
      // Else add user to database
      if (results.length != 0) {
        connection.release();
        return res.send({
          'code': 0,
          'message': 'Email is already registered',
        });
      } else {
        // Create query
        let manager = 'U';
        if (req.body.hotelowner) manager = 'M';
        let insertquery = `INSERT INTO users VALUES (DEFAULT,'${req.body.email}', '${req.body.firstname}', '${req.body.lastname}', 'undefined', '${manager}', 'undefined', '${req.body.password}');`;
        // Insert user into database
        connection.query(insertquery, function(err2, results2) {
          if (err2) throw err2;
          connection.release();
          return res.send({
            'code': 1,
            'message': 'User registered!',
          });
        });
      }
    });
  });
});

router.post('/login', function(req, res, next) {
  // If login details present, attempt login

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    let email = req.body.email;
    let password = req.body.password;
    let query = "select * from users where email= ? and user_password= ?;";
    connection.query(query, [email, password], function(err, results) {
      console.log(results);
      connection.release();

      // If user exists and password matches
      // Record user current session
      if (results.length == 0) {
        return res.send({
          'login': 0,
        });
      } else {
        sessions[req.session.id] = results[0];
        console.log(sessions[req.session.id]);
        return res.send({
          'login': 1,
        });
      }
    });
  });
});

// If logged in using google
router.post('/googlelogin', function(req, res, next) {
  if (req.body.idtoken !== undefined) {
    console.log('Google token received');
    verify(req.body.idtoken, req).catch(console.error);
    return res.send({
      'login': 1
    });
  } else { // If there is no input
    return res.send({
      'login': 0
    });
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
  
  // Get google user info
  const payload = ticket.getPayload();
  const email = payload['email'];
  const passwordgen = generatePassword();
  // NOTE: This isnt stored...
  //  const userid = payload['sub'];
  
  // Update database (if appropriate) and login
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let query = `select * from users where email='${email}';`;
    connection.query(query, function(err, results) {
      // If user exists, login
      if (results.length != 0) {
        connection.release();
        sessions[req.session.id] = results[0];
      // Else, create user in database and login
      } else {
        // Insert user into database
        let insertquery = `INSERT INTO users VALUES (DEFAULT,'${email}', '${payload['given_name']}', '${payload['family_name']}', 'undefined', 'U', 'undefined', '${passwordgen}');`;
        connection.query(insertquery, function(err, results) {
          if (err) throw err;
          // Login
          connection.query(query, function(err, results) {
            if (err) throw err;
            connection.release();
            sessions[req.session.id] = results[0];
          });
        });
      }
    });
  });
}

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

// Return user id (email) for the current session
router.get('/usersession.json', function(req, res, next) {
  if (sessions[req.session.id] == null) {
    return res.send({
      'login': 0
    });
  } else {
    res.send(sessions[req.session.id]);
  }
});

router.get('/managersession.json', function(req, res, next) {
  if (sessions[req.session.id] == null) {
    return res.send({
      'login': 0
    });
  } else if (users[sessions[req.session.id]].manageracc != 1) {
    return res.send({
      'login': 0
    });
  } else {
    res.send(users[sessions[req.session.id]]);
  }
});

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send({
        'success': 1
      });
    }
  });
});

module.exports = router;
