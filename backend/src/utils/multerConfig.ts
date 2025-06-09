import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const isValid =
      file.mimetype.startsWith("image") || file.mimetype.startsWith("video");
    if (!isValid) {
      cb(new Error("Only image and video files are allowed"));
    } else {
      cb(null, true);
    }
  },
});
