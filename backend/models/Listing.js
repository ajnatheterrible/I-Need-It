const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 1000 },
    sellerDescription: { type: String, maxlength: 1000 },

    originalPrice: { type: Number },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String },
    isFreeShipping: { type: Boolean, default: false },
    shippingCost: { type: Number, default: 0 },

    department: {
      type: String,
      enum: ["Menswear", "Womenswear"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Tops",
        "Bottoms",
        "Outerwear",
        "Footwear",
        "Tailoring",
        "Accessories",
        "Dresses",
      ],
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: [
        "XXS",
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "One Size",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
      ],
    },
    color: {
      type: String,
      required: true,
      enum: [
        "Black",
        "White",
        "Gray",
        "Beige",
        "Brown",
        "Navy",
        "Olive",
        "Red",
        "Blue",
        "Pink",
        "Purple",
        "Green",
        "Other",
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New/Never Worn", "Gently Used", "Used", "Very Worn"],
    },

    tags: [String],
    images: [String],
    favoritesCount: { type: Number, default: 0 },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    canOffer: { type: Boolean, default: true },
    isSold: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    authenticated: { type: Boolean, default: false },

    listingCode: { type: String },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
