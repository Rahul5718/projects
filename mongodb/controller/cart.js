const User = require('../model/user');
const path = require('path');

// Get and display cart page
exports.getCart = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('No user found. Please log in or create a valid user in MongoDB.');
  }
  res.sendFile(path.join(__dirname, '../views/cart.html'));
};

// API endpoint to fetch cart JSON data for client-side JS
exports.getCartData = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user found.' });
  }

  try {
    // Instantiate User using native data from middleware
    const user = new User(req.user.name, req.user.email, req.user.cart, req.user._id);
    const products = await user.getCart();

    // Format to match what frontend JS expects
    const formattedItems = products.map(p => ({
      productId: p,
      quantity: p.quantity
    }));

    res.json(formattedItems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Unable to load cart data.' });
  }
};

// Delete a product from the cart
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const user = new User(req.user.name, req.user.email, req.user.cart, req.user._id);
  
  user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.status(200).json({ message: 'Deleted successfully!' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Deleting failed.' });
    });
};

exports.postClearCart = (req, res, next) => {
  const user = new User(req.user.name, req.user.email, req.user.cart, req.user._id);
  user
    .clearCart()
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  const user = new User(req.user.name, req.user.email, req.user.cart, req.user._id);
  user
    .addOrder()
    .then(result => {
      console.log('Order placed successfully!');
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  User.getOrders(req.user._id)
    .then(orders => {
      // Console log all orders of the user as requested
      console.log('--- USER ORDERS ---', orders);
      
      // If returning JSON for a frontend view or rendering
      res.status(200).json(orders);
    })
    .catch(err => console.log(err));
};