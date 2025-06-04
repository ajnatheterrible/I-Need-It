const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");
const crypto = require("crypto");
const { Resend } = require("resend");
const asyncHandler = require("../middleware/asyncHandler");
const createError = require("../utils/createError");

const passwordValidationRules = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const reserved = [
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
  if (reserved.includes(username.toLowerCase()))
    throw createError("This username is not allowed", 400);
  if (!username || !email || !password)
    throw createError("All fields are required", 400);
  if (!validator.isAlphanumeric(username))
    throw createError("Username can only contain letters and numbers", 400);
  if (!validator.isEmail(email)) throw createError("Invalid email", 400);
  if (!validator.isStrongPassword(password, passwordValidationRules))
    throw createError(
      "Password must include uppercase, number, and special character",
      400
    );

  const existsByEmail = await User.findOne({ email });
  if (existsByEmail) throw createError("Email is already registered", 400);

  const existsByUsername = await User.findOne({
    usernameLower: username.toLowerCase(),
  });
  if (existsByUsername) throw createError("Username is already taken", 400);

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
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();

  if (!email || !password) throw createError("All fields are required", 400);
  if (!validator.isEmail(email)) throw createError("Invalid email format", 400);

  const user = await User.findOne({ email });
  if (!user || user.authProvider !== "local")
    throw createError("Invalid email or password", 401);
  if (!(await user.matchPassword(password)))
    throw createError("Invalid email or password", 401);

  const token = generateToken(user._id);
  res.json({
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  });
});

exports.requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw createError("Email is required", 400);

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.authProvider !== "local") {
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent" });
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
  if (process.env.NODE_ENV !== "production") {
    console.log(`🔐 Password reset link: ${resetURL}`);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "I Need It <noreply@resend.dev>",
    to: [email],
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>
      <p>Click below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetURL}">Reset Password</a>
    `,
  });

  res
    .status(200)
    .json({ message: "If that email exists, a reset link has been sent" });
});

exports.validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw createError("Token is required", 400);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw createError("Token is invalid or expired", 400);
  res.status(200).json({ message: "Valid token" });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword)
    throw createError("Token and password are required", 400);

  if (!validator.isStrongPassword(newPassword, passwordValidationRules)) {
    throw createError(
      "Minimum 6 characters, with uppercase, number, and symbol.",
      400
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw createError("Invalid or expired reset token", 400);
  if (user.authProvider !== "local")
    throw createError("Reset unavailable for this account", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const authToken = generateToken(user._id);
  res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
    user,
    authToken,
  });
});
