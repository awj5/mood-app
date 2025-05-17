import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Share } from "lucide-react-native";
import QuotesData from "data/quotes.json";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { theme, pressedDefault } from "utils/helpers";

type QuoteType = {
  quote: string;
  author: string;
  hasImage?: boolean;
  tags: number[];
};

type QuoteProps = {
  checkIns?: CheckInType[];
  tags?: number[];
  dates?: CalendarDatesType;
};

export default function Quote(props: QuoteProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [quoteData, setQuoteData] = useState<QuoteType>();
  const [authorImage, setAuthorImage] = useState("");
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const url = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  useEffect(() => {
    let tags: number[] = [];

    if (props.checkIns && props.dates?.rangeStart) {
      // All check-in tags
      for (let i = 0; i < props.checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);

        for (let i = 0; i < mood.tags.length; i++) {
          let tag = mood.tags[i];
          if (!tags.includes(tag)) tags.push(tag);
        }
      }
    } else if (props.checkIns) {
      // Latest check-in tags
      const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood);
      tags = mood.tags;
    } else if (props.tags) {
      tags = props.tags;
    }

    const randTag = tags[Math.floor(Math.random() * tags.length)];
    const quotes = QuotesData.filter((item) => item.tags.includes(randTag)); // Quotes with random tag

    if (quotes.length) {
      const random = quotes[Math.floor(Math.random() * quotes.length)]; // Random quote
      setQuoteData(random);

      const image = random.author
        .replace(/ /g, "-")
        .replace(/\./g, "")
        .replace(/ö/g, "o")
        .replace(/é/g, "e")
        .replace(/ç/g, "c")
        .replace(/ë/g, "e")
        .toLowerCase();

      setAuthorImage(random.hasImage ? image + ".jpg" : "");
    }

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.opaqueBg,
        borderRadius: spacing,
        padding: spacing,
        gap: spacing,
        opacity,
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
          WORDS OF WISDOM
        </Text>

        {/*<Pressable
          onPress={() => alert("Coming soon")}
          style={({ pressed }) => [
            pressedDefault(pressed),
            styles.share,
            { margin: Device.deviceType !== 1 ? -2 : -1.5 },
          ]}
          hitSlop={16}
        >
          <Share
            color={colors.primary}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
          />
        </Pressable>*/}
      </View>

      <View style={{ gap: spacing / 2 }}>
        <Text
          style={{
            fontFamily: "Tiempos-RegularItalic",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
            lineHeight: Device.deviceType !== 1 ? 28 : 22,
          }}
          allowFontScaling={false}
        >
          “{quoteData?.quote}”
        </Text>

        <View style={[styles.author, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
          <Image
            source={{ uri: url + authorImage }}
            style={[
              styles.image,
              {
                width: Device.deviceType !== 1 ? 44 : 32,
                display: authorImage ? "flex" : "none",
                backgroundColor: colors.opaqueBg,
              },
            ]}
          />

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            {`${!authorImage ? "\u2014 " : ""}${quoteData?.author}`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  share: {
    position: "absolute",
    right: 0,
  },
  author: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  image: {
    aspectRatio: "1/1",
    borderRadius: 999,
  },
});
