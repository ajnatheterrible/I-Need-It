require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");

require("./config/passport");

const runCleanupJob = require("./cron/cleanup");
const authRoutes = require("./routes/authRoutes");

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    runCleanupJob();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
