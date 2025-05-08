import { useContext, useEffect, useRef } from "react";
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
import { CircleArrowRight } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { MoodType } from "app/check-in";
import { theme } from "utils/helpers";

type NextProps = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
  disabled?: boolean;
  mood?: SharedValue<MoodType>;
};

export default function Next(props: NextProps) {
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const colors = theme();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const fadedInRef = useRef(false);

  const press = () => {
    if (opacity.value > 0.25) {
      props.setState(true);
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
    () => props.mood && props.mood.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue?.color && opacity.value > 0 && !fadedInRef.current) {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
        fadedInRef.current = true;
      }
    }
  );

  useEffect(() => {
    if (!props.disabled) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    } else {
      opacity.value = withDelay(
        !opacity.value ? 1500 : 0,
        withTiming(0.25, { duration: 300, easing: !opacity.value ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic) })
      );
    }
  }, [props.disabled]);

  return (
    <Animated.View
      style={[
        styles.container,
        dimensions.width > dimensions.height ? styles.landscape : styles.portrait,
        {
          opacity,
          paddingBottom: insets.bottom,
          zIndex: props.color !== undefined ? 1 : 0,
        },
        dimensions.width > dimensions.height
          ? { paddingLeft: Device.deviceType !== 1 ? 224 : 152, paddingTop: insets.top }
          : { paddingTop: Device.deviceType !== 1 ? 224 : 152 },
      ]}
      pointerEvents="box-none"
    >
      <Pressable onPress={press} onPressIn={pressIn} onPressOut={pressOut} hitSlop={8}>
        <CircleArrowRight
          color={props.color !== undefined ? props.color : colors.primary}
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
