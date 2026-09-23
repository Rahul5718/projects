const User = require('../model/user');
const Product = require('../model/product');
const path = require('path');

// Get and display cart items (rendering raw HTML)
exports.getCart = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('No user found. Please log in or create a valid user in MongoDB.');
  }

  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart && user.cart.items ? user.cart.items : [];

      res.sendFile(path.join(__dirname, '../views/cart.html'));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Unable to load cart.');
    });
};

// API endpoint or route to fetch cart data for client-side JS
exports.getCartData = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user found. Please log in or create a valid user in MongoDB.' });
  }

  try {
    const user = await req.user.populate('cart.items.productId');
    let items = user.cart && user.cart.items ? user.cart.items : [];

    if (!items.length) {
      const products = await Product.find({}).lean();
      items = products.map(product => ({
        productId: product,
        quantity: 1
      }));
    }

    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Unable to load cart data.' });
  }
};

// Delete a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user found. Please log in or create a valid user in MongoDB.' });
  }

  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Unable to remove item from cart.' });
    });
};