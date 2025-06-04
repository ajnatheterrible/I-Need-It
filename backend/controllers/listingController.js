const Listing = require("../models/Listing");
const asyncHandler = require("../middleware/asyncHandler");
const createError = require("../utils/createError");

exports.getFeedListings = asyncHandler(async (req, res) => {
  const { query, department, category, condition, size, priceMin, priceMax } =
    req.query;
  const filter = { $and: [] };

  if (query) {
    const terms = query.split(" ").map((word) => new RegExp(word, "i"));
    filter.$and.push(
      ...terms.map((term) => ({
        $or: [
          { title: term },
          { brand: term },
          { description: term },
          { tags: term },
          { category: term },
          { department: term },
        ],
      }))
    );
  }

  if (department) {
    filter.$and.push({ department: { $in: department.split(",") } });
  }

  if (category) {
    filter.$and.push({ category: { $in: category.split(",") } });
  }

  if (size) {
    filter.$and.push({ size: { $in: size.split(",") } });
  }

  if (condition) {
    filter.$and.push({ condition: { $in: condition.split(",") } });
  }

  if (priceMin || priceMax) {
    const priceFilter = {};
    if (priceMin) priceFilter.$gte = parseFloat(priceMin);
    if (priceMax) priceFilter.$lte = parseFloat(priceMax);
    filter.$and.push({ price: priceFilter });
  }

  if (filter.$and.length === 0) delete filter.$and;

  const listings = await Listing.find(filter);
  res.json(listings);
});

exports.getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw createError("Listing not found", 404);
  res.json(listing);
});

exports.getRandomListings = asyncHandler(async (req, res) => {
  const count = 30;
  const listings = await Listing.aggregate([
    { $match: { isSold: false, isDeleted: false } },
    { $sample: { size: count } },
  ]);
  res.json(listings);
});
