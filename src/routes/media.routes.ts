import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadMedia,
  getAllMedia,
  likeMedia,
  unlikeMedia,
  deleteMedia,
} from "../controllers/media.controller";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const isValid =
      file.mimetype.startsWith("image") || file.mimetype.startsWith("video");
    if (!isValid)
      return cb(new Error("Only image and video files are allowed"));
    cb(null, true);
  },
});

router.post("/upload", upload.single("file"), uploadMedia);
router.get("/", getAllMedia);
router.post("/:id/like", likeMedia);
router.post("/:id/unlike", unlikeMedia);
router.delete("/:id", deleteMedia);

export default router;
