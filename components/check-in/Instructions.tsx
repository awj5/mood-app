import { useEffect } from "react";
import { Text, Dimensions, useColorScheme } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { getTheme } from "utils/helpers";

type InstructionsProps = {
  wheelSize: number;
};

export default function Instructions(props: InstructionsProps) {
  const height = Dimensions.get("screen").height;
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withDelay(1500, withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          marginTop: props.wheelSize / 2 + (height <= 667 ? theme.spacing.small : theme.spacing.base),
          position: "absolute",
          top: "50%",
        },
      ]}
    >
      <Text
        style={{
          color: theme.color.secondary,
          fontSize: theme.fontSize.body,
          fontFamily: "Circular-Book",
          textAlign: "center",
        }}
        allowFontScaling={false}
      >
        {"Rotate the wheel to select your mood\nand long press to learn more"}
      </Text>
    </Animated.View>
  );
}
