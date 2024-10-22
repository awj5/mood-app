import { useContext, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type BackgroundProps = {
  showTags: boolean;
  rotation: SharedValue<number>;
};

export default function Background(props: BackgroundProps) {
  const backgroundColor = useSharedValue("transparent");
  const opacity = useSharedValue(0);
  const borderRadius = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const colorRef = useRef("");
  const size = Device.deviceType !== 1 ? 386 : 264; // Smaller on phones

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    opacity: opacity.value,
  }));

  useAnimatedReaction(
    () => props.rotation.value,
    (currentValue, previousValue) => {
      // currentValue must be 0 or greater to return data
      if (currentValue !== previousValue && currentValue >= 0) {
        const index = Math.floor((currentValue + 15) / 30) % MoodsData.length; // Snap to 1 of 12 angles (groups of 30 degrees)
        const mood = MoodsData[index];

        if (mood.color !== colorRef.current) {
          backgroundColor.value = withTiming(mood.color, { duration: 200, easing: Easing.linear });
          if (opacity.value === 1) runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
          colorRef.current = mood.color;
        }
      }
    }
  );

  useEffect(() => {
    if (props.showTags) {
      // Expand background fullscreen
      const fullscreen = dimensions.width > dimensions.height ? dimensions.width : dimensions.height;
      width.value = withTiming(fullscreen, { duration: 500, easing: Easing.out(Easing.cubic) });
      height.value = withTiming(fullscreen, { duration: 500, easing: Easing.out(Easing.cubic) });
      borderRadius.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) });
    } else {
      // Reset
      runOnJS(() => {
        width.value = size;
        height.value = size;
        borderRadius.value = 999;
      })();
    }
  }, [props.showTags]);

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return <Animated.View style={[styles.container, animatedStyles, { zIndex: props.showTags ? 1 : 0 }]} />;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});
