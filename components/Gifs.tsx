import { useEffect, useState } from "react";
import { Text, ScrollView, View, Pressable, useColorScheme, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import GifsData from "data/gifs.json";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { pressedDefault, shuffleArray, getTheme } from "utils/helpers";

export type GifType = {
  url: string;
  link: string;
  tags: number[];
};

type GifsProps = {
  checkIns?: CheckInType[];
  dates?: CalendarDatesType;
  tags?: number[];
};

export default function Gifs(props: GifsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [gifsList, setGifsList] = useState<GifType[]>([]);

  const tenorLogo = {
    light: require("../assets/img/tenor.png"),
    dark: require("../assets/img/tenor-dark.png"),
  };

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const tags: number[] = props.tags
      ? props.tags
      : props.checkIns && !props.dates?.rangeStart
      ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood).tags
      : [];

    const allTags: number[] = [];

    if (props.checkIns) {
      // Loop all check-ins and get tags
      for (const checkIn of props.checkIns) {
        const mood: CheckInMoodType = JSON.parse(checkIn.mood);

        for (const tag of mood.tags) {
          if (!tags.includes(tag) && !allTags.includes(tag)) allTags.push(tag); // Add tag if not included already
        }
      }
    }

    let gifs = shuffleArray(GifsData.filter((item) => item.tags.some((tag) => tags.includes(tag)))); // Get gifs with latest check-in tags

    if (allTags.length) {
      const allGifs = shuffleArray(GifsData.filter((item) => item.tags.some((tag) => allTags.includes(tag)))); // Get gifs with all other check-in tags
      gifs = gifs.concat(allGifs); // Combine
    }

    gifs = gifs.slice(0, 20); // Display max. 20

    if (gifs.length < 20) {
      // Add random gifs to reach 20 total
      const urls = new Set(gifs.map((gif) => gif.url));
      const additionalGifs = shuffleArray(GifsData.filter((item) => !urls.has(item.url))).slice(0, 20 - gifs.length);
      gifs = gifs.concat(additionalGifs); // Combine
    }

    setGifsList(gifs);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          backgroundColor: theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
          gap: theme.spacing.base,
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: theme.color.primary,
            fontSize: theme.fontSize.xSmall,
          }}
          allowFontScaling={false}
        >
          RELATABLE MEMES
        </Text>

        <Pressable
          onPress={() => Linking.openURL("https://tenor.com/")}
          style={({ pressed }) => [pressedDefault(pressed), { gap: theme.spacing.base / 4, flexDirection: "row" }]}
          hitSlop={16}
        >
          <Text
            style={{
              color: theme.color.opaque,
              fontSize: theme.fontSize.xxxSmall,
              fontFamily: "Circular-Book",
              alignSelf: "center",
            }}
            allowFontScaling={false}
          >
            POWERED BY
          </Text>

          <Image
            source={tenorLogo[colorScheme as "light" | "dark"]}
            style={{ width: Device.deviceType === 1 ? 43 : 57, height: Device.deviceType === 1 ? 12 : 16 }}
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

type GifProps = {
  item: GifType;
};

function Gif(props: GifProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [loading, setLoading] = useState(true);

  return (
    <View style={{ aspectRatio: "1/1", height: Device.deviceType === 1 ? 96 : 144 }}>
      <Pressable onPress={() => Linking.openURL(props.item.link)} style={({ pressed }) => pressedDefault(pressed)}>
        <Image
          source={{ uri: props.item.url }}
          style={{ backgroundColor: theme.color.opaqueBg, width: "100%", height: "100%" }}
          onLoadEnd={() => setLoading(false)}
        />
      </Pressable>

      {loading && (
        <ActivityIndicator
          color={theme.color.primary}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      )}
    </View>
  );
}
