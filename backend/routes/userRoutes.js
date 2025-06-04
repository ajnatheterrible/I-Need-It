const express = require("express");
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getUserById,
  getUserSizes,
  updateUserSizes,
} = require("../controllers/userController");

router.get("/:id", getUserById);
router.post("/:id/favorites", addFavorite);
router.delete("/:id/favorites/:listingId", removeFavorite);
router.get("/:id/sizes", getUserSizes);
router.put("/:id/sizes", updateUserSizes);

module.exports = router;
