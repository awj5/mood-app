import { useContext, useEffect, useState } from "react";
import { Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { MoodType } from "app/check-in";
import Mood from "./heading/Mood";
import { getTheme } from "utils/helpers";

type HeadingProps = {
  text: string;
  wheelSize: number;
  description?: string;
  delay?: number;
  foreground?: string;
  mood?: SharedValue<MoodType>;
  colorPress?: () => void;
};

export default function Heading(props: HeadingProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const [mood, setMood] = useState<number | undefined>();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useAnimatedReaction(
    () => props.mood?.value,
    (currentVal, previousVal) => {
      if (currentVal !== previousVal && opacity.value === 1) runOnJS(setMood)(currentVal?.id);
    }
  );

  useEffect(() => {
    if (!reduceMotion)
      opacity.value = withDelay(
        props.delay ? props.delay : 0,
        withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) })
      );
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          paddingTop: insets.top,
          zIndex: props.foreground ? 1 : 0,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: theme.spacing.base,
          gap: theme.spacing.base / 2,
        },
        dimensions.width > dimensions.height
          ? {
              paddingRight: props.wheelSize / 2 + theme.spacing.base,
              paddingBottom: insets.bottom,
              height: "100%",
              width: "50%",
              left: 0,
            }
          : {
              paddingBottom: props.wheelSize / 2,
              height: "50%",
              top: 0,
              maxWidth: Device.deviceType === 1 ? 336 : 512,
            },
      ]}
    >
      {mood ? (
        <Mood id={mood} colorPress={props.colorPress} />
      ) : (
        <>
          <Text
            style={{
              color: props.foreground ? props.foreground : theme.color.primary,
              fontSize: theme.fontSize.xxLarge,
              fontFamily: "Circular-Black",
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            {props.text}
          </Text>

          {props.description && (
            <Text
              style={{
                color: props.foreground ? props.foreground : theme.color.primary,
                fontSize: theme.fontSize.large,
                fontFamily: "Circular-Book",
                textAlign: "center",
              }}
              allowFontScaling={false}
            >
              {props.description}
            </Text>
          )}
        </>
      )}
    </Animated.View>
  );
}
