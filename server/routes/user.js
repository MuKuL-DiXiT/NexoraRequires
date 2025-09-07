const express = require("express");
const { verifyAccessToken } = require("../middlewares/jwt");
const User = require("../models/user");
const router = express.Router();

// Extract user details for logged in user
router.get("/", verifyAccessToken, async (req, res) => {
  try {
    // Fetch full user details from database
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const { password, google_id, ...safeUser } = user.toObject();
    res.json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user details" });
  }
});

module.exports = router;
