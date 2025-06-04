const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const createError = require("../utils/createError");

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("favorites");
  if (!user) throw createError("User not found", 404);
  res.status(200).json(user);
});

exports.addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw createError("User not found", 404);

  const { listingId } = req.body;
  if (!user.favorites.includes(listingId)) {
    user.favorites.push(listingId);
    await user.save();
  }

  res
    .status(200)
    .json({ message: "Added to favorites", favorites: user.favorites });
});

exports.removeFavorite = asyncHandler(async (req, res) => {
  const { id, listingId } = req.params;
  const user = await User.findById(id);
  if (!user) throw createError("User not found", 404);

  user.favorites = user.favorites.filter((fav) => fav.toString() !== listingId);
  await user.save();

  res
    .status(200)
    .json({ message: "Removed from favorites", favorites: user.favorites });
});

exports.getUserSizes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("settings.sizes");
  if (!user) throw createError("User not found", 404);
  res.status(200).json(user.settings.sizes || {});
});

exports.updateUserSizes = asyncHandler(async (req, res) => {
  const { menswear, womenswear } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw createError("User not found", 404);

  user.settings.sizes = {
    menswear: menswear || {},
    womenswear: womenswear || {},
  };

  await user.save();
  res.status(200).json({
    message: "Sizes updated successfully",
    sizes: user.settings.sizes,
  });
});
