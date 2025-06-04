const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const createError = require("../utils/createError");

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

        const email = profile.emails?.[0]?.value;
        if (!email) {
          const err = createError(
            "Google account does not have a valid email",
            400
          );
          err.name = "MissingEmail";
          return done(err, false);
        }

        const existingByEmail = await User.findOne({ email });
        if (existingByEmail && !existingByEmail.googleId) {
          const err = createError("Email already registered locally", 409);
          err.name = "LocalEmailExists";
          return done(err, false);
        }

        const newUser = await User.create({
          email,
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

const requireUsername = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user || user.username === null) {
    return res.redirect("/complete-signup");
  }

  next();
});

module.exports = {
  passport,
  requireUsername,
};
