const express = require("express");
const router = express.Router();

const {
  getFeedListings,
  getListingById,
  getRandomListings,
} = require("../controllers/listingController");

router.get("/feed", getFeedListings);
router.get("/random", getRandomListings);
router.get("/:id", getListingById);

// POST /api/listings
// router.post("/", createListing);

module.exports = router;
