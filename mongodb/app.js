const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { mongoConnect } = require('./util/database');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const shopRoutes = require('./routes/route');
require('./model/product');
const User = require('./model/user');

mongoConnect(() => {
  app.use((req, res, next) => {
    User.findById('6ab284f0837dbacfb99a22b1')
      .then(user => {
        if (!user) {
          req.user = null;
          return next();
        }

        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
      })
      .catch(err => {
        console.log(err);
        req.user = null;
        next();
      });
  });

  app.use(shopRoutes);

  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});