const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.handleGoogleCallback = async (req, res) => {
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

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.patchUser = async (req, res) => {
  const { username } = req.body;

  const isValid = /^[a-zA-Z0-9]{3,30}$/.test(username);
  if (!isValid) {
    return res.status(400).json({
      message: "Username must be 3–30 characters, letters and numbers only.",
    });
  }

  const usernameLower = username.toLowerCase();

  try {
    const existing = await User.findOne({ usernameLower });
    if (existing) {
      return res.status(400).json({ message: "Username is already taken." });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.signupIncompleteAt = undefined;
    await user.save();

    res.status(200).json({ user });
  } catch (err) {
    console.error("Set username error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.cancelGoogleSignup = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (user && user.authProvider === "google" && !user.username) {
      await User.deleteOne({ _id: user._id });
    }

    return res.status(200).json({ message: "User deleted and logged out." });
  } catch (err) {
    console.error("Cancel signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
