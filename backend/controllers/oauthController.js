const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utils/createError");

exports.handleGoogleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  const hasUsername = !!req.user.username;

  res.redirect(
    hasUsername
      ? "http://localhost:5173/"
      : "http://localhost:5173/complete-signup"
  );
};

exports.getCurrentUser = require("../middleware/asyncHandler")(
  async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(200).json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(200).json({ user: null });
    }

    res.json({ user });
  }
);

exports.patchUser = require("../middleware/asyncHandler")(async (req, res) => {
  const { username } = req.body;

  const isValid = /^[a-zA-Z0-9]{3,30}$/.test(username);
  if (!isValid) {
    throw createError(
      "Username must be 3–30 characters, letters and numbers only.",
      400
    );
  }

  const usernameLower = username.toLowerCase();

  const existing = await User.findOne({ usernameLower });
  if (existing) {
    throw createError("Username is already taken.", 400);
  }

  const token = req.cookies.token;
  if (!token) {
    throw createError("Not authenticated", 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw createError("User not found", 404);
  }

  user.username = username;
  user.signupIncompleteAt = undefined;
  await user.save();

  res.status(200).json({ user });
});

exports.cancelGoogleSignup = require("../middleware/asyncHandler")(
  async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user && user.authProvider === "google" && !user.username) {
      await User.deleteOne({ _id: user._id });
    }

    res.status(200).json({ message: "User deleted and logged out." });
  }
);
