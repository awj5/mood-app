import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

export default function Loading() {
  const colors = theme();

  return (
    <View style={[styles.loading, { gap: Device.deviceType !== 1 ? 8 : 6 }]}>
      <ActivityIndicator color={colors.primary} size={Device.deviceType !== 1 ? "large" : "small"} />

      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Book",
          fontSize: Device.deviceType !== 1 ? 24 : 16,
        }}
        allowFontScaling={false}
      >
        Generating
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flexDirection: "row",
    alignItems: "center",
  },
});
