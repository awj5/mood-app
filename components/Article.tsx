import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import ArticlesData from "data/articles.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { CalendarDatesType } from "context/home-dates";
import { getMostCommon, pressedDefault } from "utils/helpers";

type ArticleType = {
  title: string;
  url: string;
  competency: number;
};

type ArticleProps = {
  checkIns?: CheckInType[];
  competency?: string;
  dates?: CalendarDatesType;
};

export default function Article(props: ArticleProps) {
  const opacity = useSharedValue(props.checkIns ? 0 : 1);
  const [articleData, setArticleData] = useState<ArticleType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const url = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  useEffect(() => {
    let article;

    if (props.checkIns && props.dates?.rangeStart) {
      // Get most common mood competency
      const competencies = [];

      for (let i = 0; i < props.checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
        competencies.push(mood.competency);
      }

      let competency = getMostCommon(competencies);
      article = ArticlesData.filter((item) => item.competency === competency)[0];
    } else if (props.checkIns) {
      let mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in mood
      let competency = mood.competency;
      article = ArticlesData.filter((item) => item.competency === competency)[0];
    } else if (props.competency) {
      // Random article with selected competency
      const articles = ArticlesData.filter((item) => item.competency.toString().startsWith(`${props.competency}.`));
      article = articles[Math.floor(Math.random() * articles.length)];
    }

    if (article) setArticleData(article);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        borderRadius: spacing,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(articleData?.url ?? "https://articles.mood.ai")}
        style={({ pressed }) => pressedDefault(pressed)}
        hitSlop={8}
      >
        <Image source={{ uri: `${url}${articleData?.competency}.jpg` }} style={styles.image} />

        <View style={[styles.wrapper, { padding: spacing }]}>
          <Text style={[styles.text, { fontSize: Device.deviceType !== 1 ? 16 : 12 }]} allowFontScaling={false}>
            FEATURED ARTICLE
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: Device.deviceType !== 1 ? 24 : 16,
                lineHeight: Device.deviceType !== 1 ? 28 : 18,
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
  image: {
    width: "100%",
    height: "100%",
  },
  wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Circular-Bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
