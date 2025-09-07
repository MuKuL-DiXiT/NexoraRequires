const cors = require('cors');
const db = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");

// Load environment variables first
dotenv.config();

// Initialize database connection
db();

const login = require("./routes/login");
const signup = require("./routes/signup");
const userRoutes = require("./routes/user");
const itemRoutes = require("./routes/itemRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200 // for legacy browser support
};

app.use(cors(corsOptions));

// Security and parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(passport.initialize());

//mounting routes
app.use("/login", login);
app.use("/signup", signup);
app.use("/user", userRoutes);
app.use("/items", itemRoutes);
app.use("/cart", cartRoutes);
app.use("/categories", categoryRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ 
    message: "API is running...", 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
