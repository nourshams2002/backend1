import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/media-db";

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
