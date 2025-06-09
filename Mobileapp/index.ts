import { Platform, AppRegistry } from "react-native";
import App from "./App";

if (Platform.OS === "android") {
  // Android-specific setup if needed
  require("react-native-gesture-handler");
}

AppRegistry.registerComponent("main", () => App);
