const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { generateToken, setTokenCookie } = require("../middlewares/jwt");
const User = require("../models/user"); // Mongoose User model
// Removed Role model, role is now a string

// Zod validation
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(4, "Role is required"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Signup
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role: roleName } = req.body;
    const filePath = req.file?.path;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Default role to 'user' if not provided or invalid
    const validRoles = ["user", "seller"];
    const role = validRoles.includes(roleName) ? roleName : "user";

    const val = userSchema.safeParse({ name, email, password, role });
    if (!val.success) {
      return res.status(400).json({
        message: val.error.issues.map((e) => e.message).join(", "),
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in Mongo
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profile: filePath || null,
      role,
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateToken({
      _id: user._id,
      email: user.email,
    });

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    const { password: _, google_id, ...safeUser } = user.toObject();

    res.json({ safeUser, token: { accessToken, refreshToken } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const val = loginSchema.safeParse({ email, password });
    if (!val.success) {
      return res.status(400).json({
        message: val.error.issues.map((e) => e.message).join(", "),
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).send("Please login with Google.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateToken({
      _id: user._id,
      email: user.email,
    });

    const { password: _, google_id, ...safeUser } = user.toObject();

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    res.json({ safeUser, token: { accessToken, refreshToken } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Logout
const logoutUser = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logout successful" });
};

// Google callback
const googleCallback = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      // Assign default role 'user' for Google signups
      user = await User.create({
        google_id: req.user.id,
        name: req.user.displayName,
        email: req.user.email,
        role: "user",
      });
    }

    const { accessToken, refreshToken } = generateToken({
      _id: user._id,
      email: user.email,
    });

    setTokenCookie(res, "accessToken", accessToken);
    setTokenCookie(res, "refreshToken", refreshToken);

    // Get safe user data (without password and google_id)
    const { password: _, google_id, ...safeUser } = user.toObject();

    // Redirect with tokens as URL parameters to dedicated auth success page
    const redirectUrl = `${process.env.CLIENT_URL}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.redirect(process.env.CLIENT_URL + "/Auth?error=google_auth_failed");
  }
};

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  googleCallback,
};
