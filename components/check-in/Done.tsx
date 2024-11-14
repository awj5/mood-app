import { useContext, useEffect } from "react";
import { StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { CircleCheck } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";

type DoneProps = {
  color: string;
  sliderVal: SharedValue<number>;
  submitCheckIn: () => void;
};

export default function Done(props: DoneProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const press = () => {
    if (opacity.value > 0.25) {
      props.submitCheckIn();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pressIn = () => {
    if (opacity.value === 1) {
      opacity.value = 0.3;
    }
  };

  const pressOut = () => {
    if (opacity.value > 0.25) {
      opacity.value = 1;
    }
  };

  useAnimatedReaction(
    () => props.sliderVal.value,
    () => {
      if (opacity.value === 0.25) {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
      }
    }
  );

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(0.25, { duration: 300, easing: Easing.in(Easing.cubic) }));
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
      <Pressable onPress={press} onPressIn={pressIn} onPressOut={pressOut} style={{}} hitSlop={8}>
        <CircleCheck
          color={props.color}
          size={Device.deviceType !== 1 ? 88 : 64}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 5.5 : 4}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    zIndex: 1,
    opacity: 0,
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
