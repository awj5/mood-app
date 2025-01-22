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
  checkIns: CheckInType[];
};

export default function Article(props: ArticleProps) {
  const opacity = useSharedValue(0);
  const [articleData, setArticleData] = useState<ArticleType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const images = {
    1.01: require("../../../assets/img/articles/1.01.jpg"),
    1.02: require("../../../assets/img/articles/1.02.jpg"),
    1.03: require("../../../assets/img/articles/1.03.jpg"),
    2.01: require("../../../assets/img/articles/1.03.jpg"),
    2.02: require("../../../assets/img/articles/2.02.jpg"),
    2.03: require("../../../assets/img/articles/2.03.jpg"),
    2.04: require("../../../assets/img/articles/2.04.jpg"),
    3.01: require("../../../assets/img/articles/2.04.jpg"),
    3.02: require("../../../assets/img/articles/3.02.jpg"),
    3.03: require("../../../assets/img/articles/3.02.jpg"),
    3.04: require("../../../assets/img/articles/3.04.jpg"),
    4.01: require("../../../assets/img/articles/4.01.jpg"),
    4.02: require("../../../assets/img/articles/4.02.jpg"),
    4.03: require("../../../assets/img/articles/4.03.jpg"),
    4.04: require("../../../assets/img/articles/4.04.jpg"),
    5.01: require("../../../assets/img/articles/5.01.jpg"),
    5.02: require("../../../assets/img/articles/5.01.jpg"),
    5.03: require("../../../assets/img/articles/5.03.jpg"),
    5.04: require("../../../assets/img/articles/5.04.jpg"),
    6.01: require("../../../assets/img/articles/6.01.jpg"),
    6.02: require("../../../assets/img/articles/6.02.jpg"),
    6.03: require("../../../assets/img/articles/6.03.jpg"),
    6.04: require("../../../assets/img/articles/6.04.jpg"),
    7.01: require("../../../assets/img/articles/7.01.jpg"),
    7.02: require("../../../assets/img/articles/8.01.jpg"),
    7.03: require("../../../assets/img/articles/7.03.jpg"),
    8.01: require("../../../assets/img/articles/8.01.jpg"),
    8.02: require("../../../assets/img/articles/8.02.jpg"),
    8.03: require("../../../assets/img/articles/8.02.jpg"),
    8.04: require("../../../assets/img/articles/8.04.jpg"),
    9.01: require("../../../assets/img/articles/4.04.jpg"),
    9.02: require("../../../assets/img/articles/14.09.jpg"),
    9.03: require("../../../assets/img/articles/9.03.jpg"),
    10.01: require("../../../assets/img/articles/2.02.jpg"),
    10.02: require("../../../assets/img/articles/10.02.jpg"),
    10.03: require("../../../assets/img/articles/10.04.jpg"),
    10.04: require("../../../assets/img/articles/10.04.jpg"),
    11.01: require("../../../assets/img/articles/11.02.jpg"),
    11.02: require("../../../assets/img/articles/11.02.jpg"),
    11.03: require("../../../assets/img/articles/11.03.jpg"),
    11.04: require("../../../assets/img/articles/11.04.jpg"),
    12.01: require("../../../assets/img/articles/12.01.jpg"),
    12.02: require("../../../assets/img/articles/1.02.jpg"),
    12.03: require("../../../assets/img/articles/12.03.jpg"),
    12.04: require("../../../assets/img/articles/12.04.jpg"),
    13.01: require("../../../assets/img/articles/13.01.jpg"),
    13.02: require("../../../assets/img/articles/13.02.jpg"),
    13.03: require("../../../assets/img/articles/1.01.jpg"),
    13.04: require("../../../assets/img/articles/13.04.jpg"),
    13.05: require("../../../assets/img/articles/13.05.jpg"),
    13.06: require("../../../assets/img/articles/13.06.jpg"),
    13.07: require("../../../assets/img/articles/13.07.jpg"),
    13.08: require("../../../assets/img/articles/13.08.jpg"),
    13.09: require("../../../assets/img/articles/13.09.jpg"),
    13.1: require("../../../assets/img/articles/13.1.jpg"),
    13.11: require("../../../assets/img/articles/4.01.jpg"),
    14.01: require("../../../assets/img/articles/14.01.jpg"),
    14.02: require("../../../assets/img/articles/14.02.jpg"),
    14.03: require("../../../assets/img/articles/9.03.jpg"),
    14.04: require("../../../assets/img/articles/14.04.jpg"),
    14.05: require("../../../assets/img/articles/14.05.jpg"),
    14.06: require("../../../assets/img/articles/13.01.jpg"),
    14.07: require("../../../assets/img/articles/14.07.jpg"),
    14.08: require("../../../assets/img/articles/4.03.jpg"),
    14.09: require("../../../assets/img/articles/14.09.jpg"),
    14.1: require("../../../assets/img/articles/14.1.jpg"),
    14.11: require("../../../assets/img/articles/14.11.jpg"),
    14.12: require("../../../assets/img/articles/5.02.jpg"),
    14.13: require("../../../assets/img/articles/13.07.jpg"),
    14.14: require("../../../assets/img/articles/14.14.jpg"),
    14.15: require("../../../assets/img/articles/14.01.jpg"),
    14.16: require("../../../assets/img/articles/14.16.jpg"),
  };

  useEffect(() => {
    const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in
    const competency = mood.competency;
    const article = ArticlesData.filter((item) => item.competency === competency)[0];

    if (article) {
      setArticleData(article);
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity,
        aspectRatio: Device.deviceType !== 1 ? "5/3" : "4/4",
        borderRadius: spacing,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(articleData?.url ?? "https://articles.mood.ai")}
        style={({ pressed }) => pressedDefault(pressed)}
        hitSlop={8}
      >
        <Image source={images[articleData?.competency as keyof typeof images]} style={styles.image} />

        <View style={[styles.wrapper, { padding: spacing }]}>
          <Text
            style={[
              styles.text,
              {
                fontSize: Device.deviceType !== 1 ? 16 : 12,
              },
            ]}
            allowFontScaling={false}
          >
            FEATURED ARTICLE
          </Text>

          <Text
            style={[
              styles.text,
              {
                fontSize: Device.deviceType !== 1 ? 20 : 16,
                lineHeight: Device.deviceType !== 1 ? 24 : 20,
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
    backgroundColor: "rgba(0,0,0,0.2)",
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
