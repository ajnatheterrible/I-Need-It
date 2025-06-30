import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import createError from "../utils/createError.js";

export const getUserFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  if (!user) throw createError("User not found", 404);
  res.status(200).json(user.favorites);
});

export const addFavorite = asyncHandler(async (req, res) => {
  const user = req.user;
  const { listingId } = req.params;

  if (!user.favorites.includes(listingId)) {
    user.favorites.push(listingId);
    await user.save();
  }

  res.status(200).json({
    message: "Added to favorites",
    favorites: user.favorites,
  });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const user = req.user;
  const { listingId } = req.params;

  user.favorites = user.favorites.filter((fav) => fav.toString() !== listingId);
  await user.save();

  res.status(200).json({
    message: "Removed from favorites",
    favorites: user.favorites,
  });
});

export const getUserSizes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("settings.sizes");
  if (!user) throw createError("User not found", 404);
  res.status(200).json(user.settings.sizes || {});
});

export const updateUserSizes = asyncHandler(async (req, res) => {
  const user = req.user;
  const { menswear, womenswear } = req.body;

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
