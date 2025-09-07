const express = require("express");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { pool } = require("../config/db");
const { loginUser, logoutUser, googleCallback } = require("../controllers/AuthController");
const User = require("../models/user");


const router = express.Router();

// login/logout
router.post("/", loginUser);
router.post("/logout", logoutUser);

// Google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // passReqToCallback: true, // only if you need req
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        } else {
          user = await User.create({
            google_id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "user",
          });
          return done(null, user);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google auth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  googleCallback
);

module.exports = router;
