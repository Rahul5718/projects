const express = require('express');
const router = express.Router();
const shopController = require('../controller/cart');

// HTML Cart Page
router.get('/cart', shopController.getCart);

// API endpoint to fetch cart JSON data for the frontend
router.get('/cart-data', shopController.getCartData);

// POST delete item from cart
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.post('/clear-cart', shopController.postClearCart);

router.post('/create-order', cartController.postOrder);
router.get('/orders', cartController.getOrders);
module.exports = router;