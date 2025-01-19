import { useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { pressedDefault } from "utils/helpers";

type ArticleProps = {
  checkIns: CheckInType[];
};

export default function Article(props: ArticleProps) {
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <Pressable
        onPress={() => alert("Coming soon")}
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
            uri: "https://articles.mood.ai/content/images/size/w2000/2025/01/DTS_Grand_Design_Daniel_Far-_Photos_ID4156.jpg",
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
            How to Get More Say in What You Do at Work
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
