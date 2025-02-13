import { Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { theme } from "utils/helpers";

export default function Upsell() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        gap: spacing,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        UPGRADE TO PRO
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  //
});
