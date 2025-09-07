const User = require('../models/user');

// Middleware to allow only admin users
const adminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch user details from database to get current role
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // Update req.user with full user data
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error checking admin permissions" });
  }
};

module.exports = { adminOnly };
