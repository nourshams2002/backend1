import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Database type enum
export enum DatabaseType {
  MONGODB = "mongodb",
  LOCAL = "local",
}

// Global database state
export let currentDbType: DatabaseType = DatabaseType.MONGODB;
export let localDb: any = null;

// Initialize local database structure
const initLocalDb = () => {
  const dbPath = path.join(__dirname, "../../data/local-db.json");
  const dataDir = path.dirname(dbPath);

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Initialize empty database if file doesn't exist
  if (!fs.existsSync(dbPath)) {
    const initialData = {
      media: [],
    };
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }

  return dbPath;
};

// Local database operations
export const localDbOperations = {
  dbPath: initLocalDb(),

  readDb() {
    const data = fs.readFileSync(this.dbPath, "utf8");
    return JSON.parse(data);
  },

  writeDb(data: any) {
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  },

  find() {
    const db = this.readDb();
    return db.media.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  findById(id: string) {
    const db = this.readDb();
    return db.media.find((item: any) => item._id === id);
  },

  create(mediaData: any) {
    const db = this.readDb();
    const newMedia = {
      _id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...mediaData,
      createdAt: new Date().toISOString(),
    };
    db.media.push(newMedia);
    this.writeDb(db);
    return newMedia;
  },

  updateById(id: string, update: any) {
    const db = this.readDb();
    const index = db.media.findIndex((item: any) => item._id === id);
    if (index === -1) return null;

    // Handle increment operations
    if (update.$inc) {
      Object.keys(update.$inc).forEach((key) => {
        db.media[index][key] = (db.media[index][key] || 0) + update.$inc[key];
      });
    } else {
      db.media[index] = { ...db.media[index], ...update };
    }

    this.writeDb(db);
    return db.media[index];
  },

  deleteById(id: string) {
    const db = this.readDb();
    const index = db.media.findIndex((item: any) => item._id === id);
    if (index === -1) return null;

    const deletedItem = db.media[index];
    db.media.splice(index, 1);
    this.writeDb(db);
    return deletedItem;
  },
};

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/minly"
    );
    console.log("✅ MongoDB connected successfully");
    currentDbType = DatabaseType.MONGODB;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    console.log("🔄 Falling back to local JSON database...");

    try {
      // Initialize local database
      initLocalDb();
      currentDbType = DatabaseType.LOCAL;
      console.log("✅ Local JSON database initialized successfully");
      console.log(`📁 Database file: ${localDbOperations.dbPath}`);
    } catch (localError) {
      console.error("❌ Failed to initialize local database:", localError);
      process.exit(1);
    }
  }
};
