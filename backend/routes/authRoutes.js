const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../controllers/authController");
const {
  handleGoogleCallback,
  getCurrentUser,
  setUsername,
} = require("../controllers/oauthController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

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
      console.log("⚡ OAuth callback fired");

      if (err) {
        console.error("❌ OAuth Error:", err);

        if (err.name === "OAuthEmailExists") {
          return res.redirect(
            "http://localhost:5173/?error=oauth_email_exists"
          );
        }

        return res.redirect("http://localhost:5173/?error=oauth_unknown_error");
      }

      if (!user) {
        console.error("❌ OAuth: No user returned from strategy");
        return res.redirect("http://localhost:5173/?error=oauth_no_user");
      }

      console.log("✅ OAuth Success — User returned:", user);
      req.user = user;
      next();
    })(req, res, next);
  },
  handleGoogleCallback
);

router.get("/me", getCurrentUser);

router.patch("/set-username", setUsername);

module.exports = router;
