const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const shopRoutes = require('./routes/route');
require('./model/product');
const User = require('./model/user');

// Attach a real user to req.user.
// Prefer the user from the request, otherwise use the first saved user in MongoDB.
app.use(async (req, res, next) => {
  try {
    const requestedUserId = req.query.userId || req.headers['x-user-id'];
    const user = requestedUserId
      ? await User.findById(requestedUserId)
      : await User.findOne({}).exec();

    req.user = user || null;
    next();
  } catch (err) {
    console.log('User lookup failed:', err.message || err);
    req.user = null;
    next();
  }
});

app.use(shopRoutes);

// Connect to MongoDB and start server
mongoose.connect('mongodb://localhost:27017/mydb')
  .then(result => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(err => {
    console.log(err);
  });