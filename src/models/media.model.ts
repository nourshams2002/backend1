import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
