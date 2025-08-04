import { useEffect, useState } from "react";
import { useColorScheme, Text, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import tagsData from "data/tags.json";
import { CheckInMoodType, CheckInType, CompanyCheckInType } from "types";
import { getTheme, shuffleArray } from "utils/helpers";

type WordType = {
  id: number;
  text: string;
  count: number;
  percentage: number;
};

type WordCloudProps = {
  checkIns: CheckInType[] | CompanyCheckInType[];
  company?: string;
};

export default function WordCloud(props: WordCloudProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [words, setWords] = useState<WordType[]>([]);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getFontSize = (percentage: number) => {
    if (percentage >= 20) return theme.fontSize.xxxLarge;
    if (percentage >= 15) return theme.fontSize.xxLarge;
    if (percentage >= 10) return theme.fontSize.xLarge;
    if (percentage >= 5) return theme.fontSize.large;
    if (percentage >= 2.5) return theme.fontSize.body;
    return theme.fontSize.small;
  };

  useEffect(() => {
    const tagsWithCount: Record<number, { id: number; name: string; count: number }> = {};

    for (const checkIn of props.checkIns) {
      const mood: CheckInMoodType = "value" in checkIn ? checkIn.value : JSON.parse(checkIn.mood); // Determine if company check-in

      for (const tag of mood.tags) {
        const data = tagsData.filter((item) => item.id === tag)[0];
        if (!tagsWithCount[tag]) tagsWithCount[tag] = { id: tag, name: data.name, count: 0 }; // Create record
        tagsWithCount[tag].count += 1;
      }
    }

    const totalTagCount = Object.values(tagsWithCount).reduce((sum, tag) => sum + tag.count, 0);

    // Get top 20 tags
    const countedWords: WordType[] = Object.values(tagsWithCount)
      .map(({ id, name, count }) => ({
        id,
        text: name,
        count,
        percentage: totalTagCount > 0 ? (count / totalTagCount) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const shuffled = shuffleArray(countedWords);
    setWords(shuffled);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          backgroundColor: theme.color.invertedOpaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.small * 2,
          gap: theme.spacing.base / 2,
          alignItems: "center",
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          fontSize: theme.fontSize.small,
          color: theme.color.inverted,
        }}
        allowFontScaling={false}
      >
        {props.company ? `${props.company} FEELS...` : "WORK'S BEEN..."}
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "baseline",
          justifyContent: "center",
          gap: theme.spacing.base / 4,
        }}
      >
        {words.map((item, index) => (
          <Text
            key={item.id}
            style={{
              fontFamily: "Circular-Book",
              color: theme.color.inverted,
              fontSize: getFontSize(item.percentage),
              lineHeight: getFontSize(item.percentage),
            }}
          >
            {item.text}
            {index + 1 !== words.length && ","}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}
