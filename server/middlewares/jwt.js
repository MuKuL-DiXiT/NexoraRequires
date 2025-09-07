const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Generate access & refresh tokens
const generateToken = (user) => {
  const payload = { _id: user._id, email: user.email };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

// Set cookie helper
const setTokenCookie = (res, tokenName, token) => {
  const maxAge =
    tokenName === "accessToken" ? 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge,
  });
};

// Middleware to verify token
const verifyTokenWithSecret = (secret, tokenName) => {
  return (req, res, next) => {
    console.log(`Verifying ${tokenName}...`);

    let token = req.cookies?.[tokenName];

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log(`${tokenName} from cookies/headers:`, token);

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;

      setTokenCookie(res, tokenName, token);
      console.log("Verified user:", req.user);
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
};

// Exports
const verifyAccessToken = verifyTokenWithSecret(process.env.JWT_SECRET, "accessToken");
const verifyRefreshToken = verifyTokenWithSecret(process.env.JWT_REFRESH_SECRET, "refreshToken");

module.exports = {
  generateToken,
  setTokenCookie,
  verifyTokenWithSecret,
  verifyAccessToken,
  verifyRefreshToken,
};
