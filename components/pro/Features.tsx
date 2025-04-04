import { View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import Item from "./features/Item";

export default function Features() {
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: spacing,
          padding: spacing * 1.5,
          gap: spacing,
        },
      ]}
    >
      <Item>Empathetic AI chat support</Item>
      <Item>Smart check-in summaries</Item>
      <Item>Actionable AI-powered insights</Item>
      <Item>Early burnout detection</Item>
      <Item>Powerful custom reports</Item>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
