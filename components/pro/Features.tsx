import { useColorScheme, View } from "react-native";
import * as Device from "expo-device";
import Item from "./features/Item";
import { getTheme } from "utils/helpers";

export default function Features() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        borderRadius: theme.spacing.base,
        padding: Device.deviceType === 1 ? theme.spacing.small * 2 : theme.spacing.small,
        gap: Device.deviceType === 1 ? theme.spacing.base : theme.spacing.base / 4,
        backgroundColor: theme.color.opaqueBg,
      }}
    >
      <Item>Empathetic AI chat</Item>
      <Item>Smart check-in summaries</Item>
      <Item>Early burnout detection</Item>
      <Item>Actionable AI-powered insights</Item>
      {/*<Item>Powerful custom reports</Item>*/}
    </View>
  );
}
