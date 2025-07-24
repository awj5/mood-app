import { View, useColorScheme, Text, Pressable } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { getTheme, pressedDefault } from "utils/helpers";
import { useEffect, useState } from "react";

type MoodProps = {
  id: number;
  colorPress: (() => void) | undefined;
};

export default function Mood(props: MoodProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = 0;
    const mood = MoodsData.filter((mood) => mood.id === props.id)[0];
    setName(mood.name);
    setSummary(mood.shortSummary);

    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }, 100);

    return () => clearTimeout(timeout);
  }, [props.id]);

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
              color: theme.color.primary,
              fontSize: theme.fontSize.xxLarge,
              fontFamily: "Circular-Bold",
            }}
            allowFontScaling={false}
          >
            {name}
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.large,
          fontFamily: "Circular-Book",
          textAlign: "center",
        }}
        allowFontScaling={false}
      >
        {summary}
      </Text>
    </Animated.View>
  );
}
