const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { verifyAccessToken } = require('../middlewares/jwt');
const { adminOnly } = require('../middlewares/adminOnly');

// Create item (admin only)
router.post('/', verifyAccessToken, adminOnly, itemController.createItem);

// Get items with filters (public)
router.get('/', itemController.getItems);

// Get single item (public)
router.get('/:id', itemController.getItem);

// Update item (admin only)
router.put('/:id', verifyAccessToken, adminOnly, itemController.updateItem);

// Delete item (admin only)
router.delete('/:id', verifyAccessToken, adminOnly, itemController.deleteItem);

module.exports = router;
