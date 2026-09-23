const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart');

router.get('/', cartController.getProducts);
router.get('/products', cartController.getProducts);
router.get('/cart', cartController.getCart);
router.get('/cart-data', cartController.getCartData);
router.post('/add-to-cart', cartController.postAddToCart);
router.post('/cart/add', cartController.postAddToCart);
router.post('/cart-delete-item', cartController.postCartDeleteProduct);
router.post('/clear-cart', cartController.postClearCart);

// New Order Routes
router.post('/create-order', cartController.postOrder);
router.get('/orders', cartController.getOrdersPage);
router.get('/orders-data', cartController.getOrdersData);

module.exports = router;