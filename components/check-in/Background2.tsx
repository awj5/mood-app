import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type Background2Props = {
  color: string;
};

export default function Background2(props: Background2Props) {
  const borderRadius = useSharedValue(999);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const bottom = useSharedValue(0);
  const right = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const size = Device.deviceType !== 1 ? 224 : 152; // Smaller on phones

  const animatedStyles = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    bottom: dimensions.width > dimensions.height ? "auto" : bottom.value,
    right: dimensions.width > dimensions.height ? right.value : "auto",
  }));

  useEffect(() => {
    // Expand background fullscreen
    right.value = (dimensions.width / 2 - size) / 2;
    bottom.value = insets.bottom + (dimensions.height / 2 - (insets.bottom + size)) / 2;
    const fullscreen = dimensions.width > dimensions.height ? dimensions.width : dimensions.height;
    width.value = withTiming(fullscreen, { duration: 500, easing: Easing.out(Easing.cubic) });
    height.value = withTiming(fullscreen, { duration: 500, easing: Easing.out(Easing.cubic) });
    borderRadius.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    bottom.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    right.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
  }, []);

  return <Animated.View style={[styles.container, animatedStyles, { backgroundColor: props.color }]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
  },
});
