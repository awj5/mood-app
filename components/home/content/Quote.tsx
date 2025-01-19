import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { MessageSquareQuote, Share } from "lucide-react-native";
import QuotesData from "data/quotes.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type QuoteType = {
  quote: string;
  author: string;
  tags: number[];
};

type QuoteProps = {
  checkIns: CheckInType[];
};

export default function Quote(props: QuoteProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [quoteData, setQuoteData] = useState<QuoteType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const stroke = Device.deviceType !== 1 ? 2 : 1.5;
  const iconSize = Device.deviceType !== 1 ? 28 : 20;

  useEffect(() => {
    const mood: CheckInMoodType = JSON.parse(props.checkIns[props.checkIns.length - 1].mood); // Latest check-in
    const tags = mood.tags;
    const quotes = QuotesData.filter((item) => item.tags.includes(tags[Math.floor(Math.random() * tags.length)])); // Quotes with random tag

    if (quotes.length) {
      setQuoteData(quotes[Math.floor(Math.random() * quotes.length)]); // Random quote
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View style={[styles.container, { opacity, gap: Device.deviceType !== 1 ? 12 : 8 }]}>
      <View style={styles.header}>
        <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
          <MessageSquareQuote color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            WORDS OF WISDOM
          </Text>
        </View>

        <Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => [pressedDefault(pressed)]} hitSlop={8}>
          <Share color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing,
          gap: spacing,
        }}
      >
        <Text
          style={{
            fontFamily: "Circular-BookItalic",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          “{quoteData?.quote}”
        </Text>

        <Text
          style={{
            fontFamily: "Circular-Medium",
            color: colors.primary,
            fontSize: fontSize,
            alignSelf: "flex-end",
          }}
          allowFontScaling={false}
        >
          — {quoteData?.author}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 672 + 32,
    width: "100%",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
