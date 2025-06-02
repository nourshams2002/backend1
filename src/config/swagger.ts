import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Media API with Database Fallback",
      version: "1.0.0",
      description: `
        A robust Express API for media upload and management with automatic database fallback.
        
        **Database System:**
        - Primary: MongoDB (preferred)
        - Fallback: Local JSON file database (automatic if MongoDB unavailable)
        
        **Features:**
        - File upload (images/videos, max 10MB)
        - Like/Unlike functionality
        - Automatic file cleanup on deletion
        - Resilient database architecture
        
        Check /api/status to see which database is currently being used.
      `,
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "System",
        description: "System status and health check endpoints",
      },
      {
        name: "Media",
        description: "Media upload and management operations",
      },
    ],
    components: {
      schemas: {
        Media: {
          type: "object",
          required: ["filename", "filepath", "type"],
          properties: {
            _id: {
              type: "string",
              description:
                "Auto-generated ID (MongoDB ObjectId or local string)",
            },
            filename: {
              type: "string",
              description: "Original filename",
            },
            filepath: {
              type: "string",
              description: "Path to uploaded file",
            },
            type: {
              type: "string",
              enum: ["image", "video"],
              description: "Media type",
            },
            likes: {
              type: "number",
              default: 0,
              description: "Number of likes",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/routes/*.ts",
    "./dist/routes/*.js", // Add compiled JS files path
    "src/routes/*.ts", // Add alternative path
  ], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
