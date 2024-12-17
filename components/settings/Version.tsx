import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { theme } from "utils/helpers";

export default function Version() {
  const colors = theme();
  const appVersion = Constants.expoConfig?.version;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <Text
        style={{
          color: colors.secondary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        Version
      </Text>

      <Text
        style={{
          color: colors.secondary,
          fontFamily: "Circular-Book",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        {appVersion}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
