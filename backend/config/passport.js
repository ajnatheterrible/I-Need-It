const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) return done(null, existingUser);

        const existingByEmail = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingByEmail && !existingByEmail.googleId) {
          const err = new Error("Email already registered locally");
          err.name = "LocalEmailExists";
          return done(err, false);
        }

        const newUser = await User.create({
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: "google",
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

const requireUsername = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.username === null) {
      return res.redirect("/complete-signup");
    }

    next();
  } catch (err) {
    return res.redirect("/");
  }
};

module.exports = {
  passport,
  requireUsername,
};
