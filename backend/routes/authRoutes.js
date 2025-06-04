const express = require("express");
const router = express.Router();
const passport = require("passport");
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  validateResetToken,
} = require("../controllers/authController");
const {
  handleGoogleCallback,
  getCurrentUser,
  setUsername,
  patchUser,
  cancelGoogleSignup,
} = require("../controllers/oauthController");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Please try again later." },
});

const shorterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many reset attempts. Please wait and try again." },
});

router.post("/register", limiter, registerUser);
router.post("/login", limiter, loginUser);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logged out" });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err) {
        if (err.name === "LocalEmailExists") {
          return res.redirect(
            "http://localhost:5173/?error=login_type_mismatch"
          );
        }

        return res.redirect("http://localhost:5173/?error=oauth_unknown_error");
      }

      if (!user) {
        return res.redirect("http://localhost:5173/?error=oauth_no_user");
      }

      req.user = user;
      next();
    })(req, res, next);
  },
  handleGoogleCallback
);

router.post("/cancel-google-signup", cancelGoogleSignup);
router.get("/me", getCurrentUser);
router.patch("/complete-signup", limiter, patchUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
