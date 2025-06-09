import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { MediaItem } from "./MediaItem";
import {
  getAllMedia,
  likeMedia,
  unlikeMedia,
  MediaItem as MediaItemType,
} from "../services/mediaService";
import { THEME } from "../constants/config";

export type MediaListRef = {
  fetchMedia: () => Promise<void>;
};

export const MediaList = forwardRef<MediaListRef>((_, ref) => {
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMedia = async () => {
    try {
      const data = await getAllMedia();
      setMediaItems(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchMedia,
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMedia();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleLike = async (id: string) => {
    try {
      const updatedItem = await likeMedia(id);
      setMediaItems((items) =>
        items.map((item) => (item._id === id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Error liking media:", error);
    }
  };

  const handleUnlike = async (id: string) => {
    try {
      const updatedItem = await unlikeMedia(id);
      setMediaItems((items) =>
        items.map((item) => (item._id === id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Error unliking media:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mediaItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MediaItem item={item} onLike={handleLike} onUnlike={handleUnlike} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
});
