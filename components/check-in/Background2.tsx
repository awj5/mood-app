import { useContext, useEffect } from "react";
import { DimensionValue, StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type Background2Props = {
  color: string;
};

export default function Background2(props: Background2Props) {
  const height = useSharedValue<DimensionValue>("0%");
  const width = useSharedValue<DimensionValue>("0%");
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const animatedStyles = useAnimatedStyle(() => ({
    height: dimensions.width > dimensions.height ? "100%" : height.value,
    width: dimensions.width > dimensions.height ? width.value : "100%",
  }));

  useEffect(() => {
    // Expand background fullscreen
    height.value = withTiming("100%", { duration: 500, easing: Easing.out(Easing.cubic) });
    width.value = withTiming("100%", { duration: 500, easing: Easing.out(Easing.cubic) });
  }, []);

  return <Animated.View style={[styles.container, animatedStyles, { backgroundColor: props.color }]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
    bottom: 0,
    right: 0,
  },
});
