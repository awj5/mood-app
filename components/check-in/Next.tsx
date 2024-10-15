import { useContext, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { CircleArrowRight } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme, pressedDefault } from "utils/helpers";

type NextProps = {
  setShowTags: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Next(props: NextProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  useEffect(() => {
    opacity.value = withDelay(1500, withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        dimensions.width > dimensions.height ? styles.landscape : styles.portrait,
        {
          opacity,
          paddingBottom: insets.bottom,
        },
        dimensions.width > dimensions.height
          ? { paddingLeft: Device.deviceType !== 1 ? 224 : 152, paddingTop: insets.top }
          : { paddingTop: Device.deviceType !== 1 ? 224 : 152 },
      ]}
    >
      <Pressable onPress={() => props.setShowTags(true)} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <CircleArrowRight
          color={colors.primary}
          size={Device.deviceType !== 1 ? 88 : 64}
          absoluteStrokeWidth
          strokeWidth={3}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
  },
  portrait: {
    bottom: 0,
    height: "50%",
  },
  landscape: {
    height: "100%",
    width: "50%",
    right: 0,
    alignItems: "center",
  },
});
