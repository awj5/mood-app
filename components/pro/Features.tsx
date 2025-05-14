import { View } from "react-native";
import * as Device from "expo-device";
import Item from "./features/Item";
import { theme } from "utils/helpers";

export default function Features() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View
      style={{
        width: "100%",
        borderRadius: spacing,
        padding: spacing * 1.5,
        gap: spacing,
        backgroundColor: colors.opaqueBg,
      }}
    >
      <Item>Empathetic AI chat</Item>
      <Item>Smart check-in summaries</Item>
      <Item>Actionable AI-powered insights</Item>
      <Item>Early burnout detection</Item>
      {/*<Item>Powerful custom reports</Item>*/}
    </View>
  );
}
