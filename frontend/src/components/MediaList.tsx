import React, { useEffect, useState } from "react";
import {
  fetchMedia,
  likeMedia,
  unlikeMedia,
  Media,
} from "../services/mediaService";
import MediaItem from "./MediaItem";

export default function MediaList() {
  const [media, setMedia] = useState<Media[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMedia = async () => {
    console.log("Starting to load media...");
    setError(null);
    setLoading(true);
    try {
      const data = await fetchMedia();
      // Log the actual data structure
      data.forEach((item) => {
        console.log("Media item:", {
          id: item._id,
          filename: item.filename,
          filepath: item.filepath,
          type: item.type,
          likes: item.likes,
        });
      });
      setMedia(data);
    } catch (err) {
      console.error("Error loading media:", err);
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleLike = async (id: string) => {
    try {
      const updated = await likeMedia(id);
      setMedia((prev) => prev.map((m) => (m._id === id ? updated : m)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like media");
    }
  };

  const handleUnlike = async (id: string) => {
    try {
      const updated = await unlikeMedia(id);
      setMedia((prev) => prev.map((m) => (m._id === id ? updated : m)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlike media");
    }
  };

  const handleDelete = (id: string) => {
    setMedia((prev) => prev.filter((m) => m._id !== id));
  };

  console.log("Current state:", { loading, error, mediaCount: media.length });

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading media items...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="media-container">
      {error && <div className="error-message">{error}</div>}
      {!loading && media.length === 0 && (
        <div className="empty-state">
          <p>No media items found</p>
          <p>Upload some images or videos to get started!</p>
        </div>
      )}
      {media.length > 0 && (
        <div className="media-grid">
          {media.map((m) => (
            <MediaItem
              key={m._id}
              id={m._id}
              filename={m.filename}
              filepath={m.filepath}
              type={m.type}
              likes={m.likes}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onDelete={() => handleDelete(m._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
