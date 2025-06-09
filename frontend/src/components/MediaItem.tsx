import React, { useState } from "react";
import { deleteMedia } from "../services/mediaService";

interface MediaItemProps {
  id: string;
  filename: string;
  filepath?: string;
  type: "image" | "video";
  likes: number;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
  onDelete: () => void;
}

export default function MediaItem({
  id,
  filename,
  filepath,
  type,
  likes,
  onLike,
  onUnlike,
  onDelete,
}: MediaItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const mediaUrl = filepath ? `http://localhost:4000${filepath}` : "";
  console.log(`Loading media: ${filename}, URL: ${mediaUrl}`);

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await onUnlike(id);
      } else {
        await onLike(id);
      }
      setIsLiked(!isLiked);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteMedia(id);
      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
    }
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${filename}`);
    setIsLoading(false);
    setError(null);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    console.error(`Failed to load image: ${mediaUrl}`, {
      src: target.src,
      naturalWidth: target.naturalWidth,
      naturalHeight: target.naturalHeight,
    });
    setIsLoading(false);
    setError("Failed to load image");
  };

  return (
    <div className={`media-item ${isDeleting ? "deleting" : ""}`}>
      <div className="media-content">
        {type === "image" ? (
          <>
            {isLoading && <div className="loading-spinner"></div>}
            <img
              src={mediaUrl}
              alt={filename}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                display: "block",
                opacity: isLoading ? 0 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </>
        ) : (
          <video
            controls
            style={{ width: "100%", height: "300px", objectFit: "cover" }}
            onError={() => setError("Failed to load video")}
          >
            <source src={mediaUrl} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="media-info">
        <div className="media-header">
          <h3 className="media-title">
            {type === "image" ? "🖼️" : "🎥"} {filename}
          </h3>
          <button
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete"
          >
            🗑️
          </button>
        </div>
        <div className="media-stats">
          <span>
            {isLiked ? "❤️" : "🤍"} {likes} likes
          </span>
          <div className="action-buttons">
            <button
              className={`button ${
                isLiked ? "button-secondary" : "button-primary"
              }`}
              onClick={handleLikeClick}
              disabled={isDeleting}
            >
              {isLiked ? "Unlike" : "Like"}
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}
