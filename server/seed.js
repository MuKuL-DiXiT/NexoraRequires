const mongoose = require("mongoose");
const User = require("./models/user");
const Category = require("./models/category");
const Item = require("./models/item");
const Cart = require("./models/cart");
require("dotenv").config();


const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Cart.deleteMany({});

    console.log("Cleared old data");

    // Categories
    const categories = await Category.insertMany([
      { name: "Electronics" },
      { name: "Books" },
      { name: "Clothing" },
      { name: "Groceries" },
      { name: "Fitness" },
    ]);

    // Items
    const items = [
      { name: "Smartphone", price: 699, category: categories[0]._id },
      { name: "Laptop", price: 1200, category: categories[0]._id },
      { name: "Headphones", price: 150, category: categories[0]._id },
      { name: "Novel: The Alchemist", price: 15, category: categories[1]._id },
      { name: "Science Textbook", price: 50, category: categories[1]._id },
      { name: "T-Shirt", price: 20, category: categories[2]._id },
      { name: "Jeans", price: 40, category: categories[2]._id },
      { name: "Milk 1L", price: 2, category: categories[3]._id },
      { name: "Eggs 12pcs", price: 3, category: categories[3]._id },
      { name: "Yoga Mat", price: 25, category: categories[4]._id },
      { name: "Dumbbells Set", price: 100, category: categories[4]._id },
    ];

    const insertedItems = await Item.insertMany(items);
    console.log("Inserted categories & items");

    // Optionally create sample users & carts
    const user1 = await User.create({ name: "Alice", email: "alice@example.com", password: "password123" });
    const user2 = await User.create({ name: "Bob", email: "bob@example.com", password: "password123" });

    await Cart.create({
      user: user1._id,
      items: [
        { item: insertedItems[0]._id, quantity: 1 },
        { item: insertedItems[3]._id, quantity: 2 },
      ],
    });

    await Cart.create({
      user: user2._id,
      items: [
        { item: insertedItems[5]._id, quantity: 3 },
        { item: insertedItems[10]._id, quantity: 1 },
      ],
    });

    console.log("Inserted sample users & carts");
    console.log("✅ Seeding completed!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

seed();
