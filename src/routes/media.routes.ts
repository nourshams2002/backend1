import express from "express";
import { upload } from "../utils/multerConfig";
import {
  uploadMedia,
  getAllMedia,
  getMediaById,
  likeMedia,
  unlikeMedia,
  deleteMedia,
} from "../controllers/media.controller";

const router = express.Router();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get database and server status
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Server and database status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 server:
 *                   type: string
 *                   example: "running"
 *                 database:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [mongodb, local]
 *                       description: "Database type being used"
 *                     status:
 *                       type: string
 *                       example: "connected"
 *                     description:
 *                       type: string
 *                       example: "Using MongoDB database"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload a media file (image or video)
 *     description: Upload files to either MongoDB or local JSON database (automatic fallback)
 *     tags: [Media]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or video file to upload (max 10MB)
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: No file uploaded, invalid file type, or file too large
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/upload", upload.single("file"), uploadMedia);

/**
 * @swagger
 * /api/media:
 *   get:
 *     summary: Get all media files
 *     description: Retrieves all media from either MongoDB or local JSON database
 *     tags: [Media]
 *     responses:
 *       200:
 *         description: List of all media files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Media'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAllMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: View or download a specific media file by ID
 *     description: |
 *       View or download the actual media file by its ID:
 *       - **Images**: Displayed inline in the browser (viewable in Swagger)
 *       - **Videos**: Downloaded as attachment with original filename
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID (MongoDB ObjectId or local string ID)
 *     responses:
 *       200:
 *         description: Media file served successfully
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *             description: Image displayed inline in browser
 *           video/*:
 *             schema:
 *               type: string
 *               format: binary
 *             description: Video file download
 *         headers:
 *           Content-Disposition:
 *             description: |
 *               - Images: `inline; filename="example.jpg"` (viewable)
 *               - Videos: `attachment; filename="example.mp4"` (download)
 *             schema:
 *               type: string
 *           Content-Type:
 *             description: MIME type of the media file
 *             schema:
 *               type: string
 *               example: 'image/jpeg'
 *       400:
 *         description: Invalid media ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Media not found or file not found on disk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getMediaById);

/**
 * @swagger
 * /api/media/{id}/like:
 *   post:
 *     summary: Like a media file
 *     description: Increment likes count. ID format varies by database (MongoDB ObjectId or local string ID)
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID (MongoDB ObjectId or local string ID)
 *     responses:
 *       200:
 *         description: Media liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid media ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/like", likeMedia);

/**
 * @swagger
 * /api/media/{id}/unlike:
 *   post:
 *     summary: Unlike a media file (decrease likes by 1)
 *     description: Decrement likes count (minimum 0). ID format varies by database type
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID (MongoDB ObjectId or local string ID)
 *     responses:
 *       200:
 *         description: Media unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: Invalid media ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/unlike", unlikeMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   delete:
 *     summary: Delete a media file
 *     description: Delete media from database and remove physical file. ID format varies by database type
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID (MongoDB ObjectId or local string ID)
 *     responses:
 *       200:
 *         description: Media deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Deleted successfully"
 *       400:
 *         description: Invalid media ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Media not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", deleteMedia);

export default router;
