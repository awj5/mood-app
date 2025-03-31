import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import ArticlesData from "data/articles.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { pressedDefault } from "utils/helpers";

type ArticleType = {
  title: string;
  url: string;
  competency: number;
};

type ArticleProps = {
  checkIns?: CheckInType[];
  competency?: string;
};

export default function Article(props: ArticleProps) {
  const opacity = useSharedValue(props.checkIns ? 0 : 1);
  const [articleData, setArticleData] = useState<ArticleType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const url = "https://hvwvyufuezybxttghqiy.supabase.co/storage/v1/object/public/content/articles/";

  const images = {
    1.01: "1.01.jpg",
    1.02: "1.02.jpg",
    1.03: "1.03.jpg",
    2.01: "1.03.jpg",
    2.02: "2.02.jpg",
    2.03: "2.03.jpg",
    2.04: "2.04.jpg",
    3.01: "2.04.jpg",
    3.02: "3.02.jpg",
    3.03: "3.02.jpg",
    3.04: "3.04.jpg",
    4.01: "4.01.jpg",
    4.02: "4.02.jpg",
    4.03: "4.03.jpg",
    4.04: "4.04.jpg",
    5.01: "5.01.jpg",
    5.02: "5.01.jpg",
    5.03: "5.03.jpg",
    5.04: "5.04.jpg",
    6.01: "6.01.jpg",
    6.02: "6.02.jpg",
    6.03: "6.03.jpg",
    6.04: "6.04.jpg",
    7.01: "7.01.jpg",
    7.02: "8.01.jpg",
    7.03: "7.03.jpg",
    8.01: "8.01.jpg",
    8.02: "8.02.jpg",
    8.03: "8.02.jpg",
    8.04: "8.04.jpg",
    9.01: "4.04.jpg",
    9.02: "14.09.jpg",
    9.03: "9.03.jpg",
    10.01: "2.02.jpg",
    10.02: "10.02.jpg",
    10.03: "10.04.jpg",
    10.04: "10.04.jpg",
    11.01: "11.02.jpg",
    11.02: "11.02.jpg",
    11.03: "11.03.jpg",
    11.04: "11.04.jpg",
    12.01: "12.01.jpg",
    12.02: "1.02.jpg",
    12.03: "12.03.jpg",
    12.04: "12.04.jpg",
    13.01: "13.01.jpg",
    13.02: "13.02.jpg",
    13.03: "1.01.jpg",
    13.04: "13.04.jpg",
    13.05: "13.05.jpg",
    13.06: "13.06.jpg",
    13.07: "13.07.jpg",
    13.08: "13.08.jpg",
    13.09: "13.09.jpg",
    13.1: "13.1.jpg",
    13.11: "4.01.jpg",
    14.01: "14.01.jpg",
    14.02: "14.02.jpg",
    14.03: "9.03.jpg",
    14.04: "14.04.jpg",
    14.05: "14.05.jpg",
    14.06: "13.01.jpg",
    14.07: "14.07.jpg",
    14.08: "4.03.jpg",
    14.09: "14.09.jpg",
    14.1: "14.1.jpg",
    14.11: "14.11.jpg",
    14.12: "5.02.jpg",
    14.13: "13.07.jpg",
    14.14: "14.14.jpg",
    14.15: "14.01.jpg",
    14.16: "14.16.jpg",
  };

  useEffect(() => {
    let article;

    if (props.checkIns) {
      const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in
      const competency = mood.competency;
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
        <Image source={{ uri: url + images[articleData?.competency as keyof typeof images] }} style={styles.image} />

        <View style={[styles.wrapper, { padding: spacing }]}>
          <Text style={[styles.text, { fontSize: Device.deviceType !== 1 ? 16 : 12 }]} allowFontScaling={false}>
            FEATURED ARTICLE
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: Device.deviceType !== 1 ? 20 : 16,
                lineHeight: Device.deviceType !== 1 ? 24 : 18,
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
