import { useEffect, useState } from "react";
import { useColorScheme, Text } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType, CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";

type WordCloudProps = {
  checkIns?: CheckInType[] | CompanyCheckInType[];
};

export default function WordCloud(props: WordCloudProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [words, setWords] = useState(["Hello", "World"]);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View style={[animatedStyles, {}]}>
      {words.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </Animated.View>
  );
}
