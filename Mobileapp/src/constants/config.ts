import { Platform } from "react-native";

// API Configuration
export const API_CONFIG = {
  // Use different base URLs based on platform
  BASE_URL: Platform.select({
    android: "http://10.0.2.2:3000/api", // Android Emulator
    ios: "http://localhost:3000/api", // iOS Simulator
    default: "http://localhost:3000/api", // Fallback
  }),
};

// Theme Configuration
export const THEME = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#f5f5f5",
    surface: "#ffffff",
    text: "#000000",
    textSecondary: "#666666",
    border: "#dddddd",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
  },
  spacing: {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
  },
  shadows: Platform.select({
    ios: {
      small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    },
    android: {
      small: {
        elevation: 2,
      },
      medium: {
        elevation: 5,
      },
    },
    default: {},
  }),
};
