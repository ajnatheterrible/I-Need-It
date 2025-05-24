const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({
      message: "Username can only contain letters and numbers.",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const isStrong = validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrong) {
    return res.status(400).json({
      message: "Password must include uppercase, number, and special character",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const existingUsername = await User.findOne({
      usernameLower: username.toLowerCase(),
    });
    if (existingUsername) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const user = await User.create({
      username,
      email,
      password,
      authProvider: "local",
    });

    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { password, username } = req.body;
  const email = req.body.email.toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (typeof password !== "string") {
    return res.status(400).json({ message: "Invalid password format" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.authProvider !== "local") {
      return res
        .status(400)
        .json({ message: "This account was created using Google login" });
    }

    const token = generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
