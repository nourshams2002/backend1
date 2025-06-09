import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { THEME } from "../constants/config";

interface Props {
  message?: string;
}

export const LoadingScreen: React.FC<Props> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={THEME.colors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.background,
  },
  message: {
    marginTop: THEME.spacing.medium,
    color: THEME.colors.text,
    fontSize: 16,
  },
});
