import { useEffect, useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import MoodsData from "data/moods.json";
import Gauge from "./burnout/Gauge";
import { CheckInType, CheckInMoodType } from "types";
import { getTheme, pressedDefault } from "utils/helpers";

type BurnoutProps = {
  checkIns: CheckInType[];
};

export default function Burnout(props: BurnoutProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [value, setValue] = useState(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    // Calculate burnout risk score
    const scores = [];

    for (const checkIn of props.checkIns) {
      const mood: CheckInMoodType = JSON.parse(checkIn.mood);
      const burnout = MoodsData.filter((item) => item.id === mood.color)[0].burnout;
      scores.push(burnout);
    }

    let subTotal = 0;
    let bonus = 0;
    let prevScore = 0;
    let negStreak = 0;
    let posStreak = 0;

    for (const score of scores) {
      // Calculate a bonus for consecutive pos or neg check-ins
      if (score > 0) {
        // Neg
        if (prevScore > 0) {
          bonus += (score / 2) * negStreak; // Increase
        } else if (subTotal + bonus < 0) {
          // Reset to min burnout
          subTotal = 0;
          bonus = 0;
        }

        negStreak++;
        posStreak = 0; // Reset
      } else if (score < 0) {
        // Pos
        if (prevScore < 0) {
          bonus += (score / 2) * posStreak; // Decrease
        } else if (subTotal + bonus > 100) {
          // Reset to max burnout
          subTotal = 100;
          bonus = 0;
        }

        posStreak++;
        negStreak = 0; // Reset
      }

      subTotal += score;
      prevScore = score;
    }

    let total = subTotal + bonus;
    total = Math.min(Math.max(total, 0), 100); // Clamp 0 - 100
    setValue(-90 + (180 * total) / 100); // Convert to rotation range
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
          backgroundColor: theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
        },
      ]}
    >
      <View style={{ padding: theme.spacing.base, justifyContent: "space-between", flex: 1, alignItems: "center" }}>
        <View style={{ gap: theme.spacing.base / 4, flexDirection: "row", alignSelf: "flex-start" }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: theme.color.primary,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            BURNOUT RISK
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              marginTop: Device.deviceType === 1 ? -1 : -2,
              color: theme.color.primary,
              fontSize: theme.fontSize.xxxSmall,
            }}
            allowFontScaling={false}
          >
            BETA
          </Text>
        </View>

        <Gauge value={value} />

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/burnout-risk/?iab=1")}
          style={({ pressed }) => [
            pressedDefault(pressed),
            { gap: theme.spacing.base / 4, flexDirection: "row", alignItems: "center" },
          ]}
          hitSlop={16}
        >
          <Info
            color={theme.color.opaque}
            size={theme.icon.small.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.small.stroke}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: theme.color.opaque,
              fontSize: theme.fontSize.xSmall,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
