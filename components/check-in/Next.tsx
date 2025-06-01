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
import { CircleArrowRight } from "lucide-react-native";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { MoodType } from "app/check-in";
import { getTheme, pressedDefault } from "utils/helpers";

type NextProps = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
  wheelSize: number;
  foreground?: string;
  disabled?: boolean;
  mood?: SharedValue<MoodType>;
};

export default function Next(props: NextProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const fadedInRef = useRef(false);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const press = () => {
    if (opacity.value > 0.25) {
      props.setState(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  useAnimatedReaction(
    () => props.mood && props.mood.value,
    (currentVal, previousVal) => {
      if (currentVal !== previousVal && currentVal?.color && opacity.value > 0 && !fadedInRef.current) {
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
      <Pressable
        onPress={press}
        style={({ pressed }) => (opacity.value === 1 ? pressedDefault(pressed) : null)}
        hitSlop={8}
      >
        <CircleArrowRight
          color={props.foreground ? props.foreground : theme.color.primary}
          size={theme.icon.xxxLarge.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.xxxLarge.stroke}
        />
      </Pressable>
    </Animated.View>
  );
}
