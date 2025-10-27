import { useEffect } from "react";
import { Platform, useColorScheme, Text } from "react-native";
import * as Device from "expo-device";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getTheme } from "utils/helpers";

type BusynessProps = {
  foreground: string;
  level?: number;
  setLevel: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export default function Busyness(props: BusynessProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          width: Device.deviceType === 1 ? 320 : 384,
          gap: theme.spacing.base,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          fontSize: theme.fontSize.small,
          color: props.foreground,
          alignSelf: "center",
        }}
        allowFontScaling={false}
      >
        WORK'S BEEN...
      </Text>

      {props.level !== undefined && (
        <SegmentedControl
          values={["Slow", "Steady", "Busy", "Maxed"]}
          selectedIndex={props.level}
          onChange={(e) => props.setLevel(e.nativeEvent.selectedSegmentIndex)}
          fontStyle={{ fontFamily: "Circular-Medium", fontSize: theme.fontSize.body }}
          appearance={
            Platform.OS === "android"
              ? props.foreground === "white"
                ? "light"
                : "dark"
              : props.foreground === "white"
              ? "dark"
              : "light"
          }
        />
      )}
    </Animated.View>
  );
}
