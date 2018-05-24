# How to set up

1. Pull repository
2. run `sudo npm install`
3. run `sudo npm install fs`
5. npm start (localhost:3000)

# Images
run `npm install --save express-fileupload`

Put this in app.js
```js
const fileUpload = require('express-fileupload');
app.use(fileUpload());
```

# Setting up the database

1. run `sudo npm install --save mysql` if you haven't already done so
2. Paste this code in your `app.js`. Change YOURPASSWORDHERE to your password used to access your mysql. 

```mysql
/* use mysql in this app */
var mysql = require('mysql');
var dbConnectionPool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'YOURPASSWORDHERE',
  database: 'Letoh'
});
app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});
```

3. **Important:** untrack app.js from git. This will prevent merge clashing since we have different passwords. Do this by using the command

```
git rm --cached app.js
```

4. Optional: Test that everything works. Start the server and go to http://localhost:3000/dbtest.json. You should see the users in the database. 
