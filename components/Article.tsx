import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import ArticlesData from "data/articles.json";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { getMostCommon, getTheme, pressedDefault } from "utils/helpers";

type ArticleType = {
  title: string;
  url: string;
  competency: number;
};

type ArticleProps = {
  checkIns?: CheckInType[];
  dates?: CalendarDatesType;
  category?: string;
};

export default function Article(props: ArticleProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [articleData, setArticleData] = useState<ArticleType>();
  const assetsURL = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    let article;

    if (props.checkIns && props.dates?.rangeStart) {
      // Get most common mood competency
      const competencies = [];

      for (const checkIn of props.checkIns) {
        let mood: CheckInMoodType = JSON.parse(checkIn.mood);
        competencies.push(mood.competency);
      }

      const competency = getMostCommon(competencies);
      article = ArticlesData.filter((item) => item.competency === competency)[0];
    } else if (props.checkIns) {
      const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in mood
      article = ArticlesData.filter((item) => item.competency === mood.competency)[0];
    } else if (props.category) {
      // Random article for selected category
      const articles = ArticlesData.filter((item) => item.competency.toString().startsWith(`${props.category}.`));
      article = articles[Math.floor(Math.random() * articles.length)];
    }

    if (article) setArticleData(article);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          aspectRatio: Device.deviceType === 1 ? "4/4" : "5/3",
          borderRadius: theme.spacing.base,
          overflow: "hidden",
        },
      ]}
    >
      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(articleData?.url ?? "https://articles.mood.ai")}
        style={({ pressed }) => pressedDefault(pressed)}
        hitSlop={8}
      >
        {articleData && (
          <Image
            source={{ uri: `${assetsURL}${articleData.competency}.jpg` }}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        <View
          style={{
            padding: theme.spacing.base,
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "space-between",
          }}
        >
          <Text style={[styles.text, { fontSize: theme.fontSize.xSmall }]} allowFontScaling={false}>
            FEATURED ARTICLE
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: theme.fontSize.body,
                lineHeight: theme.fontSize.large,
              },
            ]}
            allowFontScaling={false}
          >
            {articleData?.title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Circular-Bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
});
