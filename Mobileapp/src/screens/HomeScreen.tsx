import React, { useRef } from "react";
import { View, StyleSheet } from "react-native";
import { MediaList } from "../components/MediaList";
import { MediaUpload } from "../components/MediaUpload";
import { THEME } from "../constants/config";

export const HomeScreen: React.FC = () => {
  const mediaListRef = useRef<{ fetchMedia: () => Promise<void> }>(null);

  const handleUploadComplete = () => {
    // Refresh the media list after successful upload
    mediaListRef.current?.fetchMedia();
  };

  return (
    <View style={styles.container}>
      <MediaUpload onUploadComplete={handleUploadComplete} />
      <MediaList ref={mediaListRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
