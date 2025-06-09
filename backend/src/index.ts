import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/db";
import mediaRoutes from "./routes/media.routes";
import path from "path";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsPath = path.resolve(__dirname, "../uploads");
console.log("Serving uploads from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/media", mediaRoutes);

// Health check endpoint
app.get("/api/status", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "Server is running",
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: "Something went wrong!",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

// Start server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`✨ Server is running on port ${port}`);
      console.log(`🏥 Health Check: http://localhost:${port}/api/status`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
