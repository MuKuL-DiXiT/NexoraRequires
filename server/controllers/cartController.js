const Cart = require('../models/cart');
const Item = require('../models/item');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.item');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    
    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      // Add new item to cart
      cart.items.push({ item: itemId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate('items.item');
    
    res.json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding item to cart', error: err.message });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();
    await cart.populate('items.item');

    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart', error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      cartItem => cartItem.item.toString() !== itemId
    );

    await cart.save();
    await cart.populate('items.item');

    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart', error: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error clearing cart', error: err.message });
  }
};
