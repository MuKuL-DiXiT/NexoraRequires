const express = require('express');
const { verifyAccessToken } = require('../middlewares/jwt');
const { adminOnly } = require('../middlewares/adminOnly');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

const router = express.Router();

// Public route - get all categories
router.get('/', getCategories);

// Admin only routes
router.post('/', verifyAccessToken, adminOnly, createCategory);
router.put('/:id', verifyAccessToken, adminOnly, updateCategory);
router.delete('/:id', verifyAccessToken, adminOnly, deleteCategory);

module.exports = router;
