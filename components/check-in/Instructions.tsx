import { useEffect } from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { theme } from "utils/helpers";

export default function Instructions() {
  const opacity = useSharedValue(0);
  const colors = theme();
  const height = Dimensions.get("screen").height;

  useEffect(() => {
    opacity.value = withDelay(1500, withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, marginTop: Device.deviceType !== 1 ? 224 + 28 : height <= 667 ? 152 + 12 : 152 + 20 },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.secondary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
        allowFontScaling={false}
      >
        {"Rotate the wheel to select your mood\nthen long press the emoji to learn more"}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    opacity: 0,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
