import { useContext, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme } from "utils/helpers";

export default function Heading() {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        dimensions.width > dimensions.height ? styles.landscape : styles.portrait,
        {
          opacity,
          paddingTop: insets.top,
        },
        dimensions.width > dimensions.height
          ? { paddingRight: Device.deviceType !== 1 ? 224 : 152, paddingBottom: insets.bottom }
          : { paddingBottom: Device.deviceType !== 1 ? 224 : 152 },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? (dimensions.width > dimensions.height ? 36 : 48) : 30,
          },
        ]}
      >
        How's work?
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
  },
  portrait: {
    height: "50%",
    top: 0,
  },
  landscape: {
    height: "100%",
    width: "50%",
    left: 0,
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Bold",
  },
});
