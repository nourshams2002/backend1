import { Request, Response } from "express";
import Media from "../models/media.model";
import fs from "fs";
import path from "path";

export async function uploadMedia(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const newMedia = new Media({
      filename: req.file.originalname,
      filepath: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
    });

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
}

export async function getAllMedia(_req: Request, res: Response): Promise<void> {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function likeMedia(req: Request, res: Response): Promise<void> {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function unlikeMedia(req: Request, res: Response): Promise<void> {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteMedia(req: Request, res: Response): Promise<void> {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    const fullPath = path.join(__dirname, "../../", media.filepath);
    fs.unlink(fullPath, (err) => {
      if (err) console.error("Failed to delete file:", err);
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
