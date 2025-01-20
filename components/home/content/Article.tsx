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
  image: string;
  competency: number;
};

type ArticleProps = {
  checkIns: CheckInType[];
};

export default function Article(props: ArticleProps) {
  const opacity = useSharedValue(0);
  const [articleData, setArticleData] = useState<ArticleType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

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
    <Animated.View style={{ flex: 1, opacity }}>
      <Pressable
        onPress={() => WebBrowser.openBrowserAsync(articleData?.url ?? "https://articles.mood.ai")}
        style={({ pressed }) => [
          pressedDefault(pressed),
          {
            aspectRatio: Device.deviceType !== 1 ? "5/3" : "4/4",
            borderRadius: spacing,
            overflow: "hidden",
          },
        ]}
        hitSlop={8}
      >
        <Image
          source={{
            uri: articleData?.image,
          }}
          style={styles.image}
        />

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
