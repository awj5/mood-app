import { View, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { getTheme } from "utils/helpers";

export default function Version() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ gap: Device.deviceType !== 1 ? 24 : 16, flexDirection: "row", justifyContent: "space-between" }}>
      <Text
        style={{
          color: theme.color.secondary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        Version
      </Text>

      <Text
        style={{
          color: theme.color.secondary,
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        {Constants.expoConfig?.version}
      </Text>
    </View>
  );
}
