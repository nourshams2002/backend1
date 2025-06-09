import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import fs from "fs";
import path from "path";

// Helper function for error handling
const handleError = (res: Response, error: any, message = "Server error") => {
  console.error(`Error: ${message}:`, error);
  res.status(500).json({ message });
};

// Helper function to clean up uploaded file
const cleanupFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("File cleanup failed:", error);
  }
};

export const uploadMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      cleanupFile(req.file.path);
      res.status(400).json({ message: "File size exceeds 10MB limit" });
      return;
    }

    const mediaData = {
      filename: req.file.originalname,
      filepath: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
      likes: 0,
    };

    const newMedia = await new Media(mediaData).save();
    res.status(201).json(newMedia);
  } catch (error) {
    if (req.file) cleanupFile(req.file.path);
    next(error);
  }
};

export const getAllMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const enhancedMedia = media.map((item) => ({
      _id: item._id,
      filename: item.filename,
      filepath: item.filepath,
      type: item.type,
      likes: item.likes,
      createdAt: item.createdAt,
      isVideo: item.type === "video",
    }));

    res.json({ total: enhancedMedia.length, media: enhancedMedia });
  } catch (error) {
    next(error);
  }
};

export const getMediaById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    const filePath = path.join(__dirname, "../../", media.filepath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    const isDownload = req.query.download === "true";
    res.setHeader(
      "Content-Type",
      media.type === "image" ? "image/jpeg" : "video/mp4"
    );
    res.setHeader(
      "Content-Disposition",
      `${isDownload ? "attachment" : "inline"}; filename="${media.filename}"`
    );
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

export const likeMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
  } catch (error) {
    next(error);
  }
};

export const unlikeMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

    // Ensure likes don't go below 0
    if (media.likes < 0) {
      media.likes = 0;
      await media.save();
    }

    res.json(media);
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id);
    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    const filePath = path.join(__dirname, "../../", media.filepath);
    cleanupFile(filePath);

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    next(error);
  }
};
