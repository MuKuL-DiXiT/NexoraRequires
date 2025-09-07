const express = require('express');
const { verifyAccessToken } = require('../middlewares/jwt');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

const router = express.Router();

// All cart routes require authentication
router.use(verifyAccessToken);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update item quantity in cart
router.put('/update', updateCartItem);

// Remove item from cart
router.delete('/remove/:itemId', removeFromCart);

// Clear entire cart
router.delete('/clear', clearCart);

module.exports = router;
