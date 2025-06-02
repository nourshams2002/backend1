// src/index.ts
import express from "express";
import mongoose from "mongoose";
import mediaRoutes from "./routes/media.routes";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Mount media routes under /api/media
app.use("/api/media", mediaRoutes);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/minly")
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
