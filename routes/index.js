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

/* =================== HOTELS REQUESTS ===================== */

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
    var query = "select hotels.*, (min(rooms.price)) as price, (max(rooms.price)) as maxprice, ifnull(ceiling(avg(reviews.stars)),6) as rating, (max(rooms.occupants)) as min_occupants from hotels " +
      "left join rooms on hotels.hotel_id = rooms.hotel_id " +
      "left join reviews on rooms.room_id = reviews.room_id " +
      "group by hotels.hotel_id";

    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });
});

// Add hotel
router.post('/addHotel.json', function(req, res) {
  // Input data to database
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    let query = 'INSERT INTO hotels values (default,?,"Untitled Hotel","Hotel Address Goes Here",0,0,"Your Description Here", NULL);';
    connection.query(query, sessions[req.session.id].user_id, function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

// Updates hotel detail information
router.post('/changeHotelDetails.json', function(req, res) {
  let hotel = JSON.parse(req.body.hotel);

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }

    let query = `UPDATE hotels SET ${req.body.changed_detail} = ? WHERE hotel_id = ?`;
    connection.query(query, [
      hotel[req.body.changed_detail],
      hotel.hotel_id,
    ], function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

// Update the hotel address
// Takes a JSON object of form {hotel address lat lng}
router.post('/updateHotelAddress.json', function(req, res) {
  let hotel = JSON.parse(req.body.hotel);

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    let query = 'UPDATE hotels SET address = ?, pos_lat = ?, pos_lng = ? WHERE hotel_id = ?';
    connection.query(query, [
      req.body.address,
      req.body.lat,
      req.body.lng,
      hotel.hotel_id,
    ], function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

// Delete a hotel from the database
router.post('/deleteHotel.json', function(req, res) {
  let targetHotel = JSON.parse(req.body.hotel_id);
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    let query = 'delete from hotels where hotel_id = ?;';
    connection.query(query, targetHotel, function(err, results) {
      connection.release();
      console.log(results);
      res.send('');
    });
  });
});

/* =================== ROOMS THINGS ===================== */

// Get the rooms of a hotel by id
router.post('/getRooms.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select rooms.*, ifnull((avg(reviews.stars)),6) as stars " +
      "from rooms left join reviews on rooms.room_id = reviews.room_id " +
      "where rooms.hotel_id =" + req.body.hotel_id +
      " group by rooms.room_id";

    connection.query(query, function(err, results) {
      console.log(results);
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
    let query = 'insert into rooms values(default,?,"Room Name",100,1,"No Description");';
    connection.query(query, [req.body.hotel_id], function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

router.post('/changeRoomDetails.json', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let query = 'update rooms set name = ?, price = ?, description = ?, occupants = ? where room_id = ?';
    connection.query(query, [req.body.title, req.body.roomprice, req.body.desc, req.body.occupants, req.body.room_id], function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

/* =================== BOOKING THINGS ===================== */

// Send booking information to client
router.get('/getBookings.json', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;
    let query = 'select bookings.*, hotels.name, hotels.main_image, hotels.address, hotels.hotel_id, rooms.name as roomname, datediff(bookings.check_out,bookings.check_in)*rooms.price as cost from bookings '+
    'inner join rooms on bookings.room_id = rooms.room_id '+
    'inner join hotels on rooms.hotel_id = hotels.hotel_id '+
    'where bookings.user_id = ?;';
    connection.query(query, sessions[req.session.id].user_id, function(err, results) {
        connection.release();
        res.send(JSON.stringify(results));
    });
  });
});

router.post('/newBooking.json', function(req, res) {
  req.pool.getConnection(function(err,connection){
      if(err){throw err;}
      var query = "insert into bookings values(default,?,?,?,?,?)"
      connection.query(query, [req.body.roomid, req.body.userid, req.body.start, req.body.end, req.body.comments], function(err, results){
          connection.release();
          res.send(req.body);
      });
  });

});

/* =================== REVIEw STUFF ===================== */

// Getting a review for a user's booking - Used in the account page
router.post('/reviewstuff.json', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }

    var query = "select reviews.ref_num, reviews.review, reviews.room_id, reviews.stars " +
      "from reviews inner join users " +
      "on reviews.user_id = users.user_id " +
      "where reviews.ref_num = " +req.body.refnum;
    connection.query(query, function(err, results) {
      console.log(results);
      connection.release();
      if (results.length == 0) {
        res.send(JSON.stringify({
          "id": -1,
        }));
      } else {
        res.send(JSON.stringify(results[0]));
      }

    });
  });

});

// Gets all the reviews for a certain room
router.post('/getReviews.json', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "select users.user_id, reviews.room_id, reviews.ref_num, users.name_first, users.name_last, users.email, reviews.stars, reviews.review " +
      "from reviews inner join users on reviews.user_id = users.user_id " +
      "inner join rooms on reviews.room_id = rooms.room_id " +
      "where rooms.room_id = " + req.body.room_id;
    connection.query(query, function(err, results) {
      connection.release();
      res.send(JSON.stringify(results));
    });
  });
});

router.post('/addReview', function(req, res) {

  req.pool.getConnection(function(err, connection) {
    if (err) {
      throw err;
    }
    var query = "insert into reviews values(?,?,?,?,?);";

    connection.query(query, [req.body.roomid, req.body.refnum,req.body.user_id,req.body.stars,req.body.review], function(err, results) {
      connection.release();
      res.send('');
    });
  });

});

/* =================== USER STUFF ===================== */

router.post('/changeUserDetail', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if (err) {throw err;}

    if (req.body.firstName != undefined) {
      var query = "update users set name_first = ? where user_id = ?"+
      "' update users set name_last = ? where user_id = ? ;";
      connection.query(query, [req.body.firstName,sessions[req.session.id].user_id, req.body.lastName, sessions[req.session.id].user_id],function(err, results) {
        connection.release();
        res.send('');
      });
    }else if (req.body.address != undefined) {
      var query = "update users set address = ? where user_id = ? ;";
      connection.query(query, [req.body.address, sessions[req.session.id].user_id], function(err, results) {
        connection.release();
        res.send('');
      });
    }else if (req.body.phoneNumber != undefined) {
      var query = "update users set phone_number = ? where user_id = ? ;";
      connection.query(query, [req.body.phonenumber, sessions[req.session.id].user_id], function(err, results) {
        connection.release();
        res.send('');
      });
    }else if (req.body.email != undefined) {
      var query = "update users set email = ? where user_id = ? ;";
      connection.query(query, [req.body.email,sessions[req.session.id].user_id], function(err, results) {
        connection.release();
        res.send('');
      });
    }else if (req.body.password != undefined) {
      var query = "update users set user_password = ? where user_id = ? ;";
      connection.query(query, [req.body.password, sessions[req.session.id].user_id], function(err, results) {
        connection.release();
        res.send('');
      });
    }

  });

});

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

// Return user for the current session
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

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

// IMAGES
router.post('/upload', function(req, res) {
  // If empty
  if (isEmpty(req.files)) {
    return res.status(400).send('No files were uploaded.');
  }

  // Get file from form
  let inputfile = req.files.inputfile;

  // Check filetype
  if (!(inputfile.mimetype == 'image/jpeg' || inputfile.mimetype == 'image/png')) {
    return res.status(400).send('Please only upload .jpeg or .png files');
  }

  // Connect to the database
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;

    // Put image identifier in database
    let query = 'INSERT INTO images VALUES(default, ?, NULL);';
    connection.query(query, [req.body.hotel_id], function(err, results) {
      let query2 = 'SELECT * FROM images where image_id = last_insert_id();';
      connection.query(query2, function(err, results3) {
        var imageIn = results3[0];
        let query3 = 'UPDATE hotels SET main_image = ? WHERE hotel_id = ?;';
        connection.query(query3, [imageIn.image_id, imageIn.hotel_id], function(err, results) {
          connection.release();
          console.log(imageIn);
          // Use the mv() method to place the file somewhere on your server
          inputfile.mv(`./public/images/${imageIn.image_id}`, function(err) {
          if (err) return res.status(500).send(err);
            res.send('File uploaded!');
          });
        });
      });
    });
  });
});

router.post('/deleteHotelImage', function(req, res) {
  req.pool.getConnection(function(err, connection) {
    if (err) throw err;

    let query = 'UPDATE hotels SET main_image = NULL WHERE hotel_id = ?;';
    connection.query(query, req.body.id, function(err, results) {
      connection.release();
      res.send('');
    });
  });
});

module.exports = router;
