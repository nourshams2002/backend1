import axios, { AxiosError } from "axios";
import { API_CONFIG } from "../constants/config";

const API_URL = API_CONFIG.BASE_URL;

export interface MediaItem {
  _id: string;
  title: string;
  url: string;
  likes: number;
  createdAt: string;
}

const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data?.message || "Network error occurred");
  }
  throw new Error("An unexpected error occurred");
};

export const getAllMedia = async (): Promise<MediaItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/media`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadMedia = async (formData: FormData): Promise<MediaItem> => {
  try {
    const response = await axios.post(`${API_URL}/media/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const likeMedia = async (id: string): Promise<MediaItem> => {
  try {
    const response = await axios.post(`${API_URL}/media/${id}/like`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const unlikeMedia = async (id: string): Promise<MediaItem> => {
  try {
    const response = await axios.post(`${API_URL}/media/${id}/unlike`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
