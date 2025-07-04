import { useContext, useEffect, useRef } from "react";
import { Pressable, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { CircleArrowRight, CircleCheck } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { MoodType } from "app/check-in";
import { getTheme } from "utils/helpers";

type NextProps = {
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  func?: () => void;
  wheelSize: number;
  delay: number;
  foreground?: string;
  disabled?: boolean;
  mood?: SharedValue<MoodType>;
  sliderVal?: SharedValue<number>;
};

export default function Next(props: NextProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const fadedInRef = useRef(false);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const Icon = props.sliderVal ? CircleCheck : CircleArrowRight;

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const press = () => {
    if (opacity.value > 0.25) {
      if (props.setState) props.setState(true);
      if (props.func) props.func();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const pressIn = () => {
    if (opacity.value === 1) opacity.value = 0.3;
  };

  const pressOut = () => {
    if (opacity.value > 0.25) opacity.value = 1;
  };

  useAnimatedReaction(
    () => props.mood?.value,
    (currentVal, previousVal) => {
      if (currentVal !== previousVal && currentVal?.color && opacity.value === 0.25 && !fadedInRef.current) {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
        fadedInRef.current = true;
      }
    }
  );

  useAnimatedReaction(
    () => props.sliderVal?.value,
    (currentVal) => {
      if (currentVal && opacity.value === 0.25) {
        opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
      }
    }
  );

  useEffect(() => {
    if (!props.disabled) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    } else {
      opacity.value = withDelay(
        !opacity.value ? props.delay : 0,
        withTiming(0.25, { duration: 300, easing: !opacity.value ? Easing.in(Easing.cubic) : Easing.out(Easing.cubic) })
      );
    }
  }, [props.disabled]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          paddingBottom: insets.bottom,
          zIndex: props.foreground ? 1 : 0,
          position: "absolute",
          justifyContent: "center",
        },
        dimensions.width > dimensions.height
          ? {
              paddingLeft: props.wheelSize / 2,
              paddingTop: insets.top,
              height: "100%",
              width: "50%",
              right: 0,
              alignItems: "center",
            }
          : { paddingTop: props.wheelSize / 2, bottom: 0, height: "50%" },
      ]}
      pointerEvents="box-none"
    >
      <Pressable onPress={press} onPressIn={pressIn} onPressOut={pressOut} hitSlop={8}>
        <Icon
          color={props.foreground ? props.foreground : theme.color.primary}
          size={theme.icon.xxxLarge.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.xxxLarge.stroke}
        />
      </Pressable>
    </Animated.View>
  );
}
