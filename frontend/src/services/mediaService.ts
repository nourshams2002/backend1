// src/services/mediaService.ts

const API_BASE_URL = "http://localhost:4000/api/media";

// Interface for raw data from the backend
export interface RawMediaData {
  id?: string;
  _id?: string;
  filename: string;
  filepath?: string;
  type: string;
  likes?: number;
  createdAt?: string;
}

export interface Media {
  _id: string;
  filename: string;
  filepath: string;
  type: "image" | "video";
  likes: number;
  createdAt: string;
}

// Helper function to transform raw data to Media type
const transformMediaData = (item: RawMediaData): Media => ({
  _id: item._id || item.id || "",
  filename: item.filename,
  filepath: item.filepath || `/uploads/${item.filename}`, // Make sure we have a valid filepath
  type: item.type as "image" | "video",
  likes: item.likes || 0,
  createdAt: item.createdAt || new Date().toISOString(),
});

export async function uploadMedia(file: File): Promise<Media> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file.name);
    const response = await fetch(`${API_BASE_URL}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload response:", data);
    return transformMediaData(data);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function fetchMedia(): Promise<Media[]> {
  try {
    console.log("Fetching media from:", API_BASE_URL);
    const response = await fetch(API_BASE_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API response:", data);

    if (!data.media || !Array.isArray(data.media)) {
      console.error("Invalid media data format:", data);
      return [];
    }

    const transformedData = data.media.map((item: RawMediaData) => ({
      _id: item._id || "",
      filename: item.filename,
      filepath: item.filepath,
      type: item.type as "image" | "video",
      likes: item.likes || 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    console.log("Transformed media data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export async function likeMedia(id: string): Promise<Media> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/like`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to like media: ${response.status}`);
    }

    const data = await response.json();
    return transformMediaData(data);
  } catch (error) {
    console.error("Like error:", error);
    throw error;
  }
}

export async function unlikeMedia(id: string): Promise<Media> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/unlike`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Failed to unlike media: ${response.status}`);
    }

    const data = await response.json();
    return transformMediaData(data);
  } catch (error) {
    console.error("Unlike error:", error);
    throw error;
  }
}

export async function deleteMedia(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.status}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
}
