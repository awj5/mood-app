import { useEffect, useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import * as Network from "expo-network";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import Report from "./Report";
import { CalendarDatesType, CheckInType, CompanyCheckInType } from "types";
import { pressedDefault, getTheme } from "utils/helpers";
import { getDateRange, getMonday } from "utils/dates";

type SummaryProps = {
  text: string;
  getInsights: () => Promise<void>;
  dates: CalendarDatesType;
  checkIns: CheckInType[] | CompanyCheckInType[];
  category?: number;
};

export default function Summary(props: SummaryProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [displayedText, setDisplayedText] = useState("");
  const monday = getMonday();
  const lastMonday = new Date(monday);
  lastMonday.setDate(monday.getDate() - 7);

  const title = `${
    props.dates.title
      ? `${props.dates.title} `
      : !props.dates.rangeStart && monday.getTime() === props.dates.weekStart.getTime()
      ? "THIS WEEK'S "
      : !props.dates.rangeStart && lastMonday.getTime() === props.dates.weekStart.getTime()
      ? "LAST WEEK'S "
      : ""
  }INSIGHTS`;

  const subTitle = getDateRange(props.dates, true);

  const colorPress = (name: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: name,
      },
    });
  };

  const validateText = async (text: string) => {
    const network = await Network.getNetworkStateAsync();

    setDisplayedText(
      text
        ? text
        : network.isInternetReachable
        ? "Unable to generate insights at the moment."
        : "You must be online to generate insights"
    );
  };

  useEffect(() => {
    validateText(props.text);
  }, [props.text]);

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{ gap: theme.spacing.base / 4, flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ display: props.text ? "flex" : "none", width: "100%" }}>
        <View style={{ alignItems: "center", gap: theme.spacing.base / 4 }}>
          <View
            style={{
              gap: theme.spacing.small / 2,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Sparkles
              color={theme.color.primary}
              size={theme.icon.base.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.base.stroke}
            />

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: theme.color.primary,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              {title}
            </Text>
          </View>

          {title === "INSIGHTS" && (
            <Text
              style={{
                fontFamily: "Circular-Book",
                color: theme.color.opaque,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              {subTitle}
            </Text>
          )}
        </View>

        <View style={{ position: "absolute", right: 0 }}>
          <Report
            text={props.text}
            visible={!!props.text}
            checkIns={props.checkIns}
            func={props.getInsights}
            category={props.category}
            opaque
          />
        </View>
      </View>

      <ParsedText
        parse={[
          {
            pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Plum|Maroon|Red/,
            style: { textDecorationLine: "underline", fontFamily: "Circular-Medium" },
            onPress: colorPress,
          },
          {
            pattern: /energy\s?\(\d+%\)|stress\s?\(\d+%\)/gi,
            style: { fontFamily: "Circular-Bold" },
          },
        ]}
        style={{
          color: props.text ? theme.color.primary : theme.color.opaque,
          fontSize: theme.fontSize.body,
          fontFamily: "Circular-Book",
          textAlign: "center",
        }}
      >
        {displayedText}
      </ParsedText>

      {!props.text && (
        <Pressable onPress={() => props.getInsights()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
          <Text
            style={{
              color: theme.color.primary,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
              textDecorationLine: "underline",
            }}
            allowFontScaling={false}
          >
            Try again
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
