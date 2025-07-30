import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, PixelRatio, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import * as WebBrowser from "expo-web-browser";
import Svg, { Line } from "react-native-svg";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import MoodsData from "data/moods.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { pressedDefault, getTheme } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Stats(props: StatsProps) {
  const localization = getLocales();
  const fontScale = PixelRatio.getFontScale();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [data, setData] = useState<barDataItem[]>([]);
  const [busyness, setBusyness] = useState(66);
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const dataItems: barDataItem[] = [];
    const dates: Date[] = [];
    let chartType = "week"; // week, days or months
    let start = new Date(); // Init
    let end = new Date(); // Init

    if (props.dates.rangeStart && props.dates.rangeEnd) {
      // Range
      start = new Date(props.dates.rangeStart);
      end = new Date(props.dates.rangeEnd);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // Calculate no. of days

      if (days <= 62) {
        // Day view
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          dates.push(new Date(date));
        }

        chartType = "days";
      } else {
        // Month view
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
          // Add date if month (and year) not already included
          if (!dates.some((d) => d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()))
            dates.push(new Date(date));
        }

        chartType = "months";
      }
    } else {
      // Week
      for (let i = 0; i < 7; i++) {
        const date = new Date(props.dates.weekStart);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    }

    const busynessScores = [];

    for (const date of dates) {
      // Get date check-ins
      const checkIns = props.checkIns.filter((item) => {
        const itemDate = new Date(`${item.date}Z`); // Convert to UTC
        itemDate.setHours(0, 0, 0, 0);

        return chartType === "months"
          ? itemDate.getTime() >= start.getTime() &&
              itemDate.getTime() <= end.getTime() &&
              itemDate.getMonth() === date.getMonth() &&
              itemDate.getFullYear() === date.getFullYear()
          : itemDate.getTime() === date.getTime();
      });

      const energyScores = [];
      const stressScores = [];

      for (const checkIn of checkIns) {
        const mood: CheckInMoodType = JSON.parse(checkIn.mood);
        energyScores.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
        stressScores.push(MoodsData.filter((item) => item.id === mood.color)[0].stress);
        let busynessScore;

        switch (mood.busyness) {
          case 0:
            busynessScore = 0;
            break;
          case 2:
            busynessScore = 100;
            break;
          default:
            busynessScore = 50;
        }

        busynessScores.push(busynessScore);
      }

      // Energy
      dataItems.push({
        label:
          chartType === "months"
            ? months[date.getMonth()]
            : chartType === "days" && localization[0].languageTag === "en-US"
            ? `${date.getMonth() + 1}/${date.getDate()}`
            : chartType === "days"
            ? `${date.getDate()}/${date.getMonth() + 1}`
            : days[date.getDay()],
        value: energyScores.length
          ? Math.max(Math.floor(energyScores.reduce((sum, num) => sum + num, 0) / energyScores.length), 0)
          : 0,
        spacing: theme.spacing.small / 4,
        frontColor: theme.color.inverted,
        labelTextStyle: {
          fontFamily: "Circular-Medium",
          fontSize:
            fontScale >= 1.2 && chartType === "days"
              ? theme.fontSize.xxxSmall
              : fontScale >= 1.2 || chartType === "days"
              ? theme.fontSize.xxSmall
              : theme.fontSize.xSmall,
          color: energyScores.length ? theme.color.primary : theme.color.opaque,
        },
        labelWidth: theme.spacing.small * 2 + theme.spacing.small / 4,
      });

      dataItems.push({
        value: stressScores.length
          ? Math.max(Math.floor(stressScores.reduce((sum, num) => sum + num, 0) / stressScores.length), 0)
          : 0,
        frontColor: theme.color.primary,
      }); // Stress
    }

    setBusyness(busynessScores.reduce((sum, num) => sum + num, 0) / busynessScores.length);
    setData(dataItems);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [props.checkIns, colorScheme]);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          backgroundColor: theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
        },
      ]}
    >
      <View style={{ gap: theme.spacing.base / 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: theme.spacing.base / 4 }}>
            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: theme.color.primary,
                fontSize: theme.fontSize.xSmall,
              }}
              allowFontScaling={false}
            >
              MOOD LEVELS
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

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/mood-levels/?iab=1")}
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

        <View style={{ gap: theme.spacing.base, flexDirection: "row", justifyContent: "center" }}>
          <View style={[styles.key, { gap: theme.spacing.small / 2 }]}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: theme.color.inverted,
                  width: theme.spacing.small,
                },
              ]}
            />

            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: theme.color.primary,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              Energy
            </Text>
          </View>

          <View style={[styles.key, { gap: theme.spacing.small / 2 }]}>
            <View style={[styles.dot, { backgroundColor: theme.color.primary, width: theme.spacing.small }]} />

            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: theme.color.primary,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              Stress
            </Text>
          </View>

          <View style={[styles.key, { gap: theme.spacing.small / 2 }]}>
            <Svg height={theme.stroke} width={theme.spacing.small}>
              <Line
                x1="0"
                y1={theme.stroke / 2}
                x2={theme.spacing.small}
                y2={theme.stroke / 2}
                stroke={theme.color.primary}
                strokeWidth={theme.stroke}
                strokeDasharray={theme.stroke * 2}
              />
            </Svg>

            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: theme.color.primary,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              Workload
            </Text>
          </View>
        </View>
      </View>

      <View style={{ overflow: "hidden" }}>
        <BarChart
          data={data}
          width={
            dimensions.width > dimensions.height
              ? 768 - theme.spacing.base * 4 - theme.spacing.base * 2.5
              : dimensions.width - theme.spacing.base * 4 - theme.spacing.base * 2.5
          }
          height={Device.deviceType === 1 ? 80 : 112}
          barWidth={theme.spacing.small}
          spacing={Device.deviceType === 1 ? theme.spacing.small : theme.spacing.base * 2}
          yAxisThickness={0}
          xAxisThickness={0}
          maxValue={100}
          noOfSections={4}
          yAxisLabelWidth={theme.spacing.base * 2.5}
          roundedTop
          roundedBottom
          yAxisLabelSuffix="%"
          yAxisTextStyle={{
            fontFamily: "Circular-Book",
            fontSize: fontScale >= 1.2 ? theme.fontSize.xxSmall : theme.fontSize.xSmall,
            color: theme.color.opaque,
          }}
          yAxisExtraHeight={theme.spacing.base}
          initialSpacing={theme.spacing.base / 2}
          rulesColor={theme.color.primary === "black" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
          rulesType="solid"
          disablePress
          showReferenceLine1
          referenceLine1Position={busyness}
          referenceLine1Config={{
            type: "dashed",
            color: theme.color.primary,
            thickness: theme.stroke,
          }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  key: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    aspectRatio: "1/1",
    borderRadius: 999,
  },
});
