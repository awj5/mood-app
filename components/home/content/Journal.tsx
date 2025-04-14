import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import { CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type JournalProps = {
  checkIns: CheckInType[];
};

export default function Journal(props: JournalProps) {
  const colors = theme();
  const router = useRouter();
  const opacity = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [entries, setEntries] = useState<CheckInType[]>([]);
  const [count, setCount] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const grey = colors.primary !== "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const iconSize = Device.deviceType !== 1 ? 40 : 24;
  const iconStroke = Device.deviceType !== 1 ? 3 : 2;

  const convertDate = (date: Date) => {
    const today = new Date();
    const year = today.getFullYear();
    const utc = new Date(`${date}Z`);
    const entryDate = new Date(utc);
    const entryYear = entryDate.getFullYear();

    return entryDate
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        weekday: "short",
        ...(entryYear !== year && { year: "numeric" }), // Only show year if not current year
      })
      .replace(",", "");
  };

  const arrowPress = (count: number) => {
    setCount(count);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false }); // Reset
  };

  const colorPress = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
  };

  const datePress = () => {
    const utc = new Date(`${entries[count].date}Z`);

    router.push({
      pathname: "day",
      params: { day: utc.getDate(), month: utc.getMonth() + 1, year: utc.getFullYear() },
    });
  };

  useEffect(() => {
    const checkIns = [];

    // Get check-ins with notes
    for (let i = 0; i < props.checkIns.length; i++) {
      let checkIn = props.checkIns[i];
      if (checkIn.note) checkIns.push(checkIn);
    }

    setCount(checkIns.length ? checkIns.length - 1 : 0);
    setEntries(checkIns);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        opacity,
      }}
    >
      <View style={{ flex: 1, padding: spacing }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: invertedColor,
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          JOURNAL
        </Text>

        {Device.deviceType !== 1 ? (
          <Svg
            width="32"
            height="40"
            viewBox="0 0 32 40"
            fill={invertedColor}
            style={{ position: "absolute", right: spacing }}
          >
            <Path d="M31.1111 40L15.5556 31.1111L0 40V4.44444V0H4.44445H26.6667H31.1111V4.44444V40Z" />
          </Svg>
        ) : (
          <Svg
            width="22"
            height="28"
            viewBox="0 0 22 28"
            fill={invertedColor}
            style={{ position: "absolute", right: spacing }}
          >
            <Path d="M21.7778 28L10.8889 21.7778L0 28V3.11111V0H3.11111H18.6667H21.7778V3.11111V28Z" />
          </Svg>
        )}

        {entries?.length ? (
          <View style={{ flex: 1, marginTop: spacing / 2, gap: spacing / 4 }}>
            <View style={styles.date}>
              <Pressable
                onPress={() => arrowPress(count - 1)}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
                disabled={!count}
              >
                <ChevronLeft
                  color={!count ? grey : invertedColor}
                  size={iconSize}
                  absoluteStrokeWidth
                  strokeWidth={iconStroke}
                />
              </Pressable>

              <Pressable onPress={() => datePress()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
                <Text
                  style={{
                    fontFamily: "Circular-Medium",
                    color: invertedColor,
                    fontSize: fontSize,
                  }}
                  allowFontScaling={false}
                >
                  {convertDate(entries[count].date)}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => arrowPress(count + 1)}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
                disabled={count === entries.length - 1}
              >
                <ChevronRight
                  color={count === entries.length - 1 ? grey : invertedColor}
                  size={iconSize}
                  absoluteStrokeWidth
                  strokeWidth={iconStroke}
                />
              </Pressable>
            </View>

            <ScrollView ref={scrollViewRef} nestedScrollEnabled={true}>
              <Animated.View key={entries[count].id} entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
                <ParsedText
                  parse={[
                    {
                      pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Aubergine|Burgundy|Red/,
                      style: { textDecorationLine: "underline" },
                      onPress: colorPress,
                    },
                  ]}
                  style={{
                    fontFamily: "Circular-BookItalic",
                    color: invertedColor,
                    fontSize: fontSize,
                    lineHeight: Device.deviceType !== 1 ? 24 : 18,
                  }}
                  allowFontScaling={false}
                >
                  {entries[count].note.replace("[NOTE FROM USER]:", "")}
                </ParsedText>
              </Animated.View>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.empty}>
            <Text
              style={[
                styles.text,
                {
                  color: invertedColor,
                  fontSize: fontSize,
                },
              ]}
              allowFontScaling={false}
            >
              Your chat summaries with MOOD will appear here.
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  date: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    opacity: 0.5,
    textAlign: "center",
  },
});
