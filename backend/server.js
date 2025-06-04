require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/errorHandler");

require("./config/passport");

const runCleanupJob = require("./cron/cleanup");
const authRoutes = require("./routes/authRoutes");
const listingRoutes = require("./routes/listingRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    runCleanupJob();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
