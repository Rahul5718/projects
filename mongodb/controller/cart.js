const User = require('../model/user');
const Product = require('../model/product');
const path = require('path');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();

    const productHtml = products.map(product => `
      <div class="product-card" style="border:1px solid #ddd; padding:12px; margin:12px 0;">
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <button type="button" class="add-cart-btn" data-product-id="${product._id}">Add to Cart</button>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Products</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .product-card { max-width: 520px; }
          .add-cart-btn { background: #007bff; color: white; padding: 8px 14px; border: none; border-radius: 4px; cursor: pointer; }
          .status { margin-top: 12px; }
        </style>
      </head>
      <body>
        <h1>Products</h1>
        <a href="/cart">Go to Cart</a>
        <div class="status" id="status"></div>
        ${productHtml || '<p>No products found.</p>'}

        <script>
          document.querySelectorAll('.add-cart-btn').forEach(button => {
            button.addEventListener('click', async () => {
              const productId = button.dataset.productId;
              const status = document.getElementById('status');

              try {
                const response = await fetch('/add-to-cart', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ productId })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Failed');

                status.textContent = 'Product added to cart successfully!';
                status.style.color = 'green';
              } catch (err) {
                status.textContent = err.message || 'Unable to add product to cart';
                status.style.color = 'red';
              }
            });
          });
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.log(err);
    res.status(500).send('Unable to load products.');
  }
};

// Get and display cart page
exports.getCart = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('No user found. Please log in or create a valid user in MongoDB.');
  }
  res.sendFile(path.join(__dirname, '../views/cart.html'));
};

exports.postAddToCart = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No user found.' });
  }

  const productId = req.body.productId;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

  const user = new User(req.user.name, req.user.email, req.user.cart, req.user._id);
  user
    .addToCart(productId)
    .then(() => {
      res.status(200).json({ message: 'Product added to cart successfully.' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Unable to add product to cart.' });
    });
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
  if (!prodId) {
    return res.status(400).json({ message: 'Product ID is required.' });
  }

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