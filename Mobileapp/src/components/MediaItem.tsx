import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MediaItem as MediaItemType } from "../services/mediaService";
import { THEME } from "../constants/config";

interface Props {
  item: MediaItemType;
  onLike: (id: string) => void;
  onUnlike: (id: string) => void;
}

export const MediaItem: React.FC<Props> = ({ item, onLike, onUnlike }) => {
  const handleLikePress = () => {
    if (item.likes > 0) {
      onUnlike(item._id);
    } else {
      onLike(item._id);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={handleLikePress} style={styles.likeButton}>
          <AntDesign
            name={item.likes > 0 ? "heart" : "hearto"}
            size={20}
            color={
              item.likes > 0 ? THEME.colors.primary : THEME.colors.textSecondary
            }
          />
          <Text style={[styles.likeText, item.likes > 0 && styles.likedText]}>
            {item.likes} {item.likes === 1 ? "Like" : "Likes"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.background,
    borderRadius: 10,
    marginVertical: THEME.spacing.small,
    marginHorizontal: THEME.spacing.medium,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: windowWidth - THEME.spacing.medium * 2,
    height: (windowWidth - THEME.spacing.medium * 2) * 0.75,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    padding: THEME.spacing.medium,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: THEME.spacing.small,
    color: THEME.colors.text,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.small,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  likeText: {
    marginLeft: THEME.spacing.small,
    color: THEME.colors.textSecondary,
    fontWeight: "600",
  },
  likedText: {
    color: THEME.colors.primary,
  },
});
