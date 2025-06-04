const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      required: function () {
        return this.authProvider === "local";
      },
      unique: true,
    },
    usernameLower: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return this.authProvider === "local";
      },
    },
    googleId: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      required: true,
      default: "local",
      index: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    soldItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thread" }],
    isDemo: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "demo"],
      default: "user",
      index: true,
    },
    settings: {
      address: { type: String, default: "" },
      paymentMethod: { type: String, default: "" },
      favoritesPublic: { type: Boolean, default: true },
      closetPublic: { type: Boolean, default: false },
      followersPublic: { type: Boolean, default: true },
      followingPublic: { type: Boolean, default: true },
      sizes: {
        menswear: {
          Tops: [String],
          Bottoms: [String],
          Outerwear: [String],
          Footwear: [String],
          Tailoring: [String],
          Accessories: [String],
        },
        womenswear: {
          Tops: [String],
          Bottoms: [String],
          Outerwear: [String],
          Footwear: [String],
          Dresses: [String],
          Accessories: [String],
          Bags: [String],
          Jewelry: [String],
        },
      },
    },
    permissions: {
      type: String,
      enum: ["read-only", "full"],
      default: "full",
    },
    signupIncompleteAt: {
      type: Date,
      default: function () {
        return this.authProvider === "google" && !this.username
          ? new Date()
          : undefined;
      },
      index: true,
    },
    resetPasswordToken: {
      type: String,
      index: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("username") && this.username) {
    this.usernameLower = this.username.toLowerCase();
  }

  if (!this.isModified("password") || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
