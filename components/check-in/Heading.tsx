import { useContext, useEffect } from "react";
import { Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { getTheme } from "utils/helpers";

type HeadingProps = {
  text: string;
  wheelSize: number;
  description?: string;
  delay?: number;
  foreground?: string;
};

export default function Heading(props: HeadingProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
              maxWidth: Device.deviceType === 1 ? 320 : 512,
            },
      ]}
    >
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
    </Animated.View>
  );
}
