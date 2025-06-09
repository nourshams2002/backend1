import React, { useState, useRef } from "react";
import { uploadMedia } from "../services/mediaService";

interface Props {
  onUploadSuccess: () => void;
}

export default function MediaUpload({ onUploadSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      setFile(selectedFile);
      // Auto upload when file is selected
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    setLoading(true);
    try {
      await uploadMedia(selectedFile);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onUploadSuccess();
      setIsModalOpen(false); // Close modal after successful upload
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="upload-button"
        onClick={() => setIsModalOpen(true)}
        title="Upload media"
      >
        +
      </button>

      {isModalOpen && (
        <div className="upload-modal">
          <button
            className="close-button"
            onClick={() => setIsModalOpen(false)}
          >
            ×
          </button>
          <div className="upload-form">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={onFileChange}
              disabled={loading}
            />
            {error && <div className="error-message">{error}</div>}
            {file && (
              <div className="file-info">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                MB)
              </div>
            )}
            {loading && <div className="loading-spinner"></div>}
          </div>
        </div>
      )}
    </>
  );
}
