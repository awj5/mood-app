import { useEffect, useState } from "react";
import { Text, View, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Share } from "lucide-react-native";
import QuotesData from "data/quotes.json";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { pressedDefault, getTheme, slugify } from "utils/helpers";

type QuoteType = {
  quote: string;
  author: string;
  hasImage?: boolean;
  tags: number[];
};

type QuoteProps = {
  checkIns?: CheckInType[];
  dates?: CalendarDatesType;
  tags?: number[];
  color?: string;
};

export default function Quote(props: QuoteProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [quoteData, setQuoteData] = useState<QuoteType>();
  const assetsURL = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const tags: number[] = props.tags
      ? props.tags
      : props.checkIns && !props.dates?.rangeStart
      ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood).tags
      : [];

    if (props.checkIns && props.dates?.rangeStart) {
      // Tags from all check-ins within date range
      for (const checkIn of props.checkIns) {
        const mood: CheckInMoodType = JSON.parse(checkIn.mood);

        for (const tag of mood.tags) {
          if (!tags.includes(tag)) tags.push(tag); // Add tag if not included already
        }
      }
    }

    const randTag = tags[Math.floor(Math.random() * tags.length)]; // Get random tag
    const quotes = QuotesData.filter((item) => item.tags.includes(randTag)); // Quotes with random tag

    if (quotes.length) {
      const random = quotes[Math.floor(Math.random() * quotes.length)]; // Random quote
      setQuoteData(random);
    }

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
          {props.color ? `${props.color.toUpperCase()} WORDS` : "WORDS OF WISDOM"}
        </Text>

        {/*<Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
          <Share
            color={theme.color.primary}
            size={theme.icon.base.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.base.stroke}
          />
        </Pressable>*/}
      </View>

      <View style={{ gap: quoteData?.hasImage ? theme.spacing.base : theme.spacing.base / 2 }}>
        <Text
          style={{
            fontFamily: "Tiempos-RegularItalic",
            color: theme.color.primary,
            fontSize: theme.fontSize.body,
            lineHeight: theme.fontSize.xLarge,
          }}
          allowFontScaling={false}
        >
          “{quoteData?.quote}”
        </Text>

        <View
          style={{
            gap: theme.spacing.small / 2,
            flexDirection: "row",
            alignSelf: "flex-end",
            alignItems: "center",
          }}
        >
          {quoteData?.hasImage && (
            <Image
              source={{ uri: `${assetsURL}${slugify(quoteData.author)}` }}
              style={{
                width: Device.deviceType === 1 ? 32 : 44,
                backgroundColor: theme.color.opaqueBg,
                aspectRatio: "1/1",
                borderRadius: 999,
              }}
            />
          )}

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.primary,
              fontSize: theme.fontSize.small,
            }}
            allowFontScaling={false}
          >
            {`${!quoteData?.hasImage ? "\u2014 " : ""}${quoteData?.author}`}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
