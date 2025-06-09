import { Router } from "express";
import { upload } from "../utils/multerConfig";
import {
  uploadMedia,
  getAllMedia,
  getMediaById,
  likeMedia,
  unlikeMedia,
  deleteMedia,
} from "../controllers/media.controller";

const router = Router();

// Upload media
router.post("/", upload.single("file"), uploadMedia);

// Get all media
router.get("/", getAllMedia);

// Get single media
router.get("/:id", getMediaById);

// Like media
router.post("/:id/like", likeMedia);

// Unlike media
router.post("/:id/unlike", unlikeMedia);

// Delete media
router.delete("/:id", deleteMedia);

export default router;
