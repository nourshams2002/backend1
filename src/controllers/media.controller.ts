import { Request, Response } from "express";
import Media from "../models/media.model";
import { currentDbType, DatabaseType, localDbOperations } from "../config/db";
import fs from "fs";
import path from "path";

export async function uploadMedia(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      // Delete the uploaded file if it's too large
      fs.unlinkSync(req.file.path);
      res
        .status(400)
        .json({ message: "File size too large. Maximum 10MB allowed." });
      return;
    }

    const mediaData = {
      filename: req.file.originalname,
      filepath: `/uploads/${req.file.filename}`,
      type: req.file.mimetype.startsWith("image") ? "image" : "video",
      likes: 0,
    };

    let newMedia;

    if (currentDbType === DatabaseType.MONGODB) {
      newMedia = new Media(mediaData);
      await newMedia.save();
    } else {
      newMedia = localDbOperations.create(mediaData);
    }

    res.status(201).json(newMedia);
  } catch (error) {
    console.error("Upload error:", error);
    // Clean up file if database save fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Failed to delete file after error:", unlinkError);
      }
    }
    res.status(500).json({ message: "Upload failed" });
  }
}

export async function getAllMedia(req: Request, res: Response): Promise<void> {
  try {
    let media;

    if (currentDbType === DatabaseType.MONGODB) {
      media = await Media.find().sort({ createdAt: -1 });
    } else {
      media = localDbOperations.find();
    }

    // Enhance the response with full URLs and additional metadata
    const enhancedMedia = media.map((item: any) => {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fullPath = path.join(__dirname, "../../", item.filepath);
      const fileExists = fs.existsSync(fullPath);

      return {
        id: item._id || item.id,
        filename: item.filename,
        type: item.type,
        likes: item.likes,
        createdAt: item.createdAt,
        // Full URLs for easy access
        viewUrl: `${baseUrl}/api/media/${item._id || item.id}`,
        downloadUrl: `${baseUrl}/api/media/${
          item._id || item.id
        }?download=true`,
        // Additional metadata
        fileExists,
        relativePath: item.filepath,
        // For frontend convenience
        isImage: item.type === "image",
        isVideo: item.type === "video",
      };
    });

    res.json({
      total: enhancedMedia.length,
      media: enhancedMedia,
    });
  } catch (err) {
    console.error("Get all media error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function likeMedia(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID format based on database type
    if (
      currentDbType === DatabaseType.MONGODB &&
      !id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      res.status(400).json({ message: "Invalid media ID format" });
      return;
    }

    let media;

    if (currentDbType === DatabaseType.MONGODB) {
      media = await Media.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
    } else {
      media = localDbOperations.updateById(id, { $inc: { likes: 1 } });
    }

    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    res.json(media);
  } catch (err) {
    console.error("Like media error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function unlikeMedia(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID format based on database type
    if (
      currentDbType === DatabaseType.MONGODB &&
      !id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      res.status(400).json({ message: "Invalid media ID format" });
      return;
    }

    let media;

    if (currentDbType === DatabaseType.MONGODB) {
      media = await Media.findByIdAndUpdate(
        id,
        { $inc: { likes: -1 } },
        { new: true }
      );
    } else {
      media = localDbOperations.updateById(id, { $inc: { likes: -1 } });
    }

    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    // Ensure likes don't go below 0
    if (media.likes < 0) {
      if (currentDbType === DatabaseType.MONGODB) {
        media.likes = 0;
        await media.save();
      } else {
        media = localDbOperations.updateById(id, { likes: 0 });
      }
    }

    res.json(media);
  } catch (err) {
    console.error("Unlike media error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteMedia(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID format based on database type
    if (
      currentDbType === DatabaseType.MONGODB &&
      !id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      res.status(400).json({ message: "Invalid media ID format" });
      return;
    }

    let media;

    if (currentDbType === DatabaseType.MONGODB) {
      media = await Media.findByIdAndDelete(id);
    } else {
      media = localDbOperations.deleteById(id);
    }

    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    // Delete the physical file
    const fullPath = path.join(__dirname, "../../", media.filepath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
      } else {
        console.log("File deleted successfully:", fullPath);
      }
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMediaById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Validate ID format based on database type
    if (
      currentDbType === DatabaseType.MONGODB &&
      !id.match(/^[0-9a-fA-F]{24}$/)
    ) {
      res.status(400).json({ message: "Invalid media ID format" });
      return;
    }

    let media;

    if (currentDbType === DatabaseType.MONGODB) {
      media = await Media.findById(id);
    } else {
      media = localDbOperations.findById(id);
    }

    if (!media) {
      res.status(404).json({ message: "Media not found" });
      return;
    }

    // Get the full path to the file
    const fullPath = path.join(__dirname, "../../", media.filepath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ message: "File not found on disk" });
      return;
    }

    // Check if download is requested
    const isDownload = req.query.download === "true";

    // Set the correct Content-Type based on the stored MIME type
    res.setHeader(
      "Content-Type",
      media.type === "image" ? "image/jpeg" : "video/mp4"
    );

    // Set disposition based on request type
    if (isDownload) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${media.filename}"`
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${media.filename}"`
      );
    }

    // Send the file
    res.sendFile(fullPath);
  } catch (err) {
    console.error("Get media by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
