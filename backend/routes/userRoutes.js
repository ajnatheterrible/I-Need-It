import express from "express";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getUserSizes,
  updateUserSizes,
} from "../controllers/userController.js";

import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/sizes", requireAuth, getUserSizes);
router.put("/sizes", requireAuth, updateUserSizes);
router.get("/favorites", requireAuth, getUserFavorites);
router.post("/favorites/:listingId", requireAuth, addFavorite);
router.delete("/favorites/:listingId", requireAuth, removeFavorite);

export default router;
