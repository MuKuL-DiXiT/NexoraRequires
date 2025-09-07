const Item = require('../models/item');
const Category = require('../models/category');

// Create Item
exports.createItem = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required.' });
    }
    const item = new Item({ name, price, description, category });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error creating item', error: err.message });
  }
};

// Get Items with Filters
exports.getItems = async (req, res) => {
  try {
    const { minPrice, maxPrice, category } = req.query;
    let filter = {};
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (category) {
      filter.category = category;
    }
    const items = await Item.find(filter).populate('category');
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items', error: err.message });
  }
};

// Get Single Item
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item', error: err.message });
  }
};

// Update Item
exports.updateItem = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price, description, category },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error updating item', error: err.message });
  }
};

// Delete Item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
};
