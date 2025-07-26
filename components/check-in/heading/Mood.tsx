import { useEffect } from "react";
import { View, useColorScheme, Text, Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { MoodType } from "app/check-in";
import { getTheme, pressedDefault } from "utils/helpers";

type MoodProps = {
  data: MoodType;
  colorPress: (() => void) | undefined;
};

export default function Mood(props: MoodProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    // Fade in on mood change
    opacity.value = 0;

    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }, 200);

    return () => clearTimeout(timeout);
  }, [props.data]);

  return (
    <Animated.View style={[animatedStyles, { alignItems: "center", gap: theme.spacing.base / 2 }]}>
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            color: theme.color.primary,
            fontSize: theme.fontSize.xxLarge,
            fontFamily: "Circular-Book",
          }}
          allowFontScaling={false}
        >
          I'm feeling&nbsp;
        </Text>

        <Pressable onPress={props.colorPress} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
          <Text
            style={{
              color: props.data.color,
              fontSize: theme.fontSize.xxLarge,
              fontFamily: "Circular-Bold",
            }}
            allowFontScaling={false}
          >
            {props.data.name}
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.large,
          lineHeight: theme.fontSize.xLarge,
          fontFamily: "Tiempos-RegularItalic",
          textAlign: "center",
        }}
        allowFontScaling={false}
      >
        {props.data.feelings}
      </Text>
    </Animated.View>
  );
}
