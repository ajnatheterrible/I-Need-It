const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const { Resend } = require("resend");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const reservedUsernames = [
    "admin",
    "support",
    "me",
    "api",
    "auth",
    "login",
    "logout",
    "signup",
    "terms",
  ];

  if (reservedUsernames.includes(username.toLowerCase())) {
    return res.status(400).json({ message: "This username is not allowed" });
  }

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validator.isAlphanumeric(username)) {
    return res.status(400).json({
      message: "Username can only contain letters and numbers",
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

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: "Please sign in using Google for this account",
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
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

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.authProvider !== "local") {
      return res.status(200).json({
        message: "If that email exists, a reset link has been sent",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:5173/forgot-password?token=${rawToken}`;
    console.log(`🔐 Password reset link: ${resetURL}`);

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password",
      html: `
  <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
    <h2 style="color: #222;">Reset your password</h2>
    <p>Hi there,</p>
    <p>We received a request to reset the password for your account.</p>
    <p>Click the button below to reset it. This link will expire in 15 minutes.</p>
    <a href="${resetURL}" style="display: inline-block; background-color: #000; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
    <p style="margin-top: 20px; font-size: 12px; color: #777;">If you didn’t request this, you can safely ignore this email.</p>
    <p style="font-size: 12px; color: #aaa;">– The I NEED IT Team</p>
  </div>
`,
    });

    return res.status(200).json({
      message: "If that email exists, a reset link has been sent",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

exports.validateResetToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token is required" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  res.status(200).json({ message: "Valid token" });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }

  const isStrong = validator.isStrongPassword(newPassword, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrong) {
    return res.status(400).json({
      message: "Minimum 6 characters, wiih uppercase, number and symbol.",
    });
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: "Password reset is unavailable for this account",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password has been reset successfully. You will now be redirected to the home page.",
      user,
      authToken,
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
