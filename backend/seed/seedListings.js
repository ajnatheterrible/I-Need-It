const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Listing = require("../models/Listing");
const User = require("../models/User");
const sampleListings = require("./sampleListings.json");

dotenv.config({ path: __dirname + "/../.env" });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log("✅ Listings seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
