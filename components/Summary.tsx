import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import ParsedText from "react-native-parsed-text";
import { CheckInType } from "data/database";
import { CalendarDatesType } from "context/home-dates";
import { CompanyCheckInType } from "app/company";
import Report from "./Report";
import { theme, pressedDefault } from "utils/helpers";
import { getDateRange, getMonday } from "utils/dates";

type SummaryProps = {
  text: string;
  getInsights: () => Promise<void>;
  dates: CalendarDatesType;
  checkIns: CheckInType[] | CompanyCheckInType[];
  category?: number;
};

export default function Summary(props: SummaryProps) {
  const colors = theme();
  const router = useRouter();
  const spacing = Device.deviceType !== 1 ? 6 : 4;
  const fontSizeSmall = Device.deviceType !== 1 ? 18 : 14;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = getMonday(today);
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

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={[styles.container, { gap: spacing }]}
    >
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6, display: props.text ? "flex" : "none" }]}>
        <Sparkles
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: fontSizeSmall,
          }}
          allowFontScaling={false}
        >
          {title}
        </Text>

        <View style={styles.report}>
          <Report
            text={props.text}
            visible={props.text ? true : false}
            checkIns={props.checkIns}
            func={props.getInsights}
            category={props.category}
            opaque
          />
        </View>
      </View>

      {props.text && title === "INSIGHTS" && (
        <Text
          style={{
            fontFamily: "Circular-Medium",
            color: colors.opaque,
            fontSize: fontSizeSmall,
          }}
          allowFontScaling={false}
        >
          {subTitle}
        </Text>
      )}

      <ParsedText
        parse={[
          {
            pattern: /Orange|Yellow|Lime|Green|Mint|Cyan|Azure|Blue|Violet|Aubergine|Burgundy|Red/,
            style: styles.color,
            onPress: colorPress,
          },
        ]}
        style={[
          styles.summary,
          {
            color: colors.primary,
            opacity: props.text ? 1 : 0.5,
            fontSize: fontSize,
          },
        ]}
      >
        {props.text ? props.text : "Unable to generate insights at the moment."}
      </ParsedText>

      {!props.text && (
        <Pressable onPress={() => props.getInsights()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
          <Text
            style={[
              styles.button,
              {
                color: colors.primary,
                fontSize: fontSize,
                padding: spacing,
              },
            ]}
            allowFontScaling={false}
          >
            Try again
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  report: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  summary: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  color: {
    textDecorationLine: "underline",
    fontFamily: "Circular-Bold",
  },
  button: {
    fontFamily: "Circular-Book",
    textDecorationLine: "underline",
  },
});
