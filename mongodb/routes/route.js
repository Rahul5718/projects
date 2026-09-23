const express = require('express');
const router = express.Router();
const shopController = require('../controller/cart');

router.get('/', shopController.getProducts);
router.get('/products', shopController.getProducts);

// HTML Cart Page
router.get('/cart', shopController.getCart);

// API endpoint to fetch cart JSON data for the frontend
router.get('/cart-data', shopController.getCartData);

// Add a product into the user's cart
router.post('/add-to-cart', shopController.postAddToCart);
router.post('/cart/add', shopController.postAddToCart);

// POST delete item from cart
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/clear-cart', shopController.postClearCart);

router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrders);
module.exports = router;