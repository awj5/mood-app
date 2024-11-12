import { useContext, useEffect } from "react";
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
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { MoodType } from "app/check-in";

type BackgroundProps = {
  showTags: boolean;
  mood: SharedValue<MoodType>;
};

export default function Background(props: BackgroundProps) {
  const backgroundColor = useSharedValue("transparent");
  const opacity = useSharedValue(0);
  const borderRadius = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const size = Device.deviceType !== 1 ? 386 : 264; // Smaller on phones

  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    opacity: opacity.value,
  }));

  useAnimatedReaction(
    () => props.mood.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue.color) {
        backgroundColor.value = withTiming(currentValue.color, { duration: 200, easing: Easing.linear });
        if (opacity.value === 1) runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
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

  return <Animated.View style={[animatedStyles, { position: "absolute", zIndex: props.showTags ? 1 : 0 }]} />;
}
