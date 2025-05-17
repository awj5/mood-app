import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import GifsData from "data/gifs.json";
import { CheckInMoodType, CheckInType } from "database";
import Gif from "./gifs/Gif";
import { CalendarDatesType } from "types";
import { theme, pressedDefault, shuffleArray } from "utils/helpers";

export type GifType = {
  url: string;
  link: string;
  tags: number[];
};

type GifsProps = {
  checkIns?: CheckInType[];
  tags?: number[];
  dates?: CalendarDatesType;
};

export default function Gifs(props: GifsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [gifsList, setGifsList] = useState<GifType[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const images = {
    light: require("../assets/img/tenor.png"),
    dark: require("../assets/img/tenor-dark.png"),
  };

  useEffect(() => {
    const tags: number[] = props.tags
      ? props.tags
      : props.checkIns && !props.dates?.rangeStart
      ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood).tags
      : [];

    const allTags: number[] = [];

    if (props.checkIns) {
      // Loop all check-ins and get tags
      for (let i = 0; i < props.checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);

        for (let i = 0; i < mood.tags.length; i++) {
          let tag = mood.tags[i];
          if (!tags.includes(tag) && !allTags.includes(tag)) allTags.push(tag);
        }
      }
    }

    let gifs = shuffleArray(GifsData.filter((item) => item.tags.some((tag) => tags.includes(tag)))); // Get gifs with latest check-in tags

    if (allTags.length) {
      const allGifs = shuffleArray(GifsData.filter((item) => item.tags.some((tag) => allTags.includes(tag)))); // Get gifs with all other check-in tags
      gifs = gifs.concat(allGifs); // Combine
    }

    gifs = gifs.slice(0, 20);

    if (gifs.length < 20) {
      // Add random gifs to reach 20 total
      const existingUrls = new Set(gifs.map((gif) => gif.url));

      const additionalGifs = shuffleArray(GifsData.filter((item) => !existingUrls.has(item.url))).slice(
        0,
        20 - gifs.length
      );

      gifs = gifs.concat(additionalGifs); // Combine
    }

    setGifsList(gifs);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        opacity,
        gap: spacing,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          RELATABLE MEMES
        </Text>

        <Pressable
          onPress={() => Linking.openURL("https://tenor.com/")}
          style={({ pressed }) => [pressedDefault(pressed), styles.logo, { gap: spacing / 4 }]}
          hitSlop={16}
        >
          <Text
            style={[
              styles.logoText,
              {
                color: colors.opaque,
                fontSize: Device.deviceType !== 1 ? 12 : 8,
              },
            ]}
            allowFontScaling={false}
          >
            POWERED BY
          </Text>

          <Image
            source={images[colors.primary === "white" ? "dark" : "light"]}
            style={{ width: Device.deviceType !== 1 ? 57 : 43, height: Device.deviceType !== 1 ? 16 : 12 }}
            contentFit="fill"
          />
        </Pressable>
      </View>

      <ScrollView horizontal>
        {gifsList.map((item, index) => (
          <Gif key={index} item={item} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
  },
  logoText: {
    fontFamily: "Circular-Book",
    marginTop: 2,
  },
});
