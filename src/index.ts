// src/index.ts
import express from "express";
import cors from "cors";
import mediaRoutes from "./routes/media.routes";
import path from "path";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger";
import { connectDB, currentDbType, DatabaseType } from "./config/db";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Setup Swagger documentation
setupSwagger(app);

// Mount media routes under /api/media
app.use("/api/media", mediaRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Media API Server is running!",
    documentation: "Visit /api-docs for API documentation",
    database: {
      type: currentDbType,
      status: "connected",
    },
  });
});

// Database status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    server: "running",
    database: {
      type: currentDbType,
      status: "connected",
      description:
        currentDbType === DatabaseType.MONGODB
          ? "Using MongoDB database"
          : "Using local JSON file database (MongoDB fallback)",
    },
    timestamp: new Date().toISOString(),
  });
});

connectDB().then(() => {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(
      `📚 API Documentation available at http://localhost:${PORT}/api-docs`
    );
    console.log(`📊 Database Status: ${currentDbType.toUpperCase()}`);
    if (currentDbType === DatabaseType.LOCAL) {
      console.log(`💾 Local database will be created at: data/local-db.json`);
    }
  });
});
