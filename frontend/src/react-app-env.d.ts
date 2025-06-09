/// <reference types="react-scripts" />

interface Media {
  _id: string;
  filename: string;
  filepath: string;
  type: "image" | "video";
  likes: number;
  createdAt: string;
}
