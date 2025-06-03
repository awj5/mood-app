import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, PixelRatio } from "react-native";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import MoodsData from "data/moods.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { theme, pressedDefault } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const localization = getLocales();
  const fontScale = PixelRatio.getFontScale();
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [data, setData] = useState<barDataItem[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const smallFont = Device.deviceType !== 1 ? 16 : 12;
  const extraSmallFont = Device.deviceType !== 1 ? 14 : 10;
  const tinyFont = Device.deviceType !== 1 ? 12 : 8;
  const barSize = Device.deviceType !== 1 ? 15 : 10;
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

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
        let date = new Date(props.dates.weekStart);
        date.setDate(date.getDate() + i);
        dates.push(date);
      }
    }

    for (let i = 0; i < dates.length; i++) {
      let date = dates[i];

      // Get date check-ins
      let checkIns = props.checkIns.filter((item) => {
        let itemDate = new Date(`${item.date}Z`); // Convert to UTC
        itemDate.setHours(0, 0, 0, 0);

        return chartType === "months"
          ? itemDate.getTime() >= start.getTime() &&
              itemDate.getTime() <= end.getTime() &&
              itemDate.getMonth() === date.getMonth() &&
              itemDate.getFullYear() === date.getFullYear()
          : itemDate.getTime() === date.getTime();
      });

      let energyScores = [];
      let stressScores = [];

      for (let i = 0; i < checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(checkIns[i].mood);
        energyScores.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
        stressScores.push(MoodsData.filter((item) => item.id === mood.color)[0].stress);
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
          ? Math.max(Math.floor(energyScores.reduce((sum, num) => sum + num, 0) / energyScores.length), 2)
          : 0,
        spacing: Device.deviceType !== 1 ? 5 : 3,
        frontColor: invertedColor,
        labelTextStyle: {
          fontFamily: "Circular-Medium",
          fontSize:
            fontScale >= 1.2 && chartType === "days"
              ? tinyFont
              : fontScale >= 1.2 || chartType === "days"
              ? extraSmallFont
              : smallFont,
          color: energyScores.length ? colors.primary : colors.opaque,
        },
        labelWidth: barSize * 2 + (Device.deviceType !== 1 ? 5 : 3),
      });

      dataItems.push({
        value: stressScores.length
          ? Math.max(Math.floor(stressScores.reduce((sum, num) => sum + num, 0) / stressScores.length), 2)
          : 0,
        frontColor: colors.primary,
      }); // Stress
    }

    setData(dataItems);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [props.checkIns, colors.primary]);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.opaqueBg,
        borderRadius: spacing,
        padding: spacing,
        opacity,
      }}
    >
      <View style={{ paddingBottom: spacing / 2 }}>
        <View style={{ flexDirection: "row", gap: spacing / 4 }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: smallFont,
            }}
            allowFontScaling={false}
          >
            MOOD LEVELS
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              marginTop: Device.deviceType !== 1 ? -2 : -1,
              color: colors.primary,
              fontSize: tinyFont,
            }}
            allowFontScaling={false}
          >
            BETA
          </Text>
        </View>

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/mood-levels/?iab=1")}
          style={({ pressed }) => [pressedDefault(pressed), styles.info, { gap: spacing / 4 }]}
          hitSlop={16}
        >
          <Info
            color={colors.opaque}
            size={Device.deviceType !== 1 ? 20 : 16}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: colors.opaque,
              fontSize: smallFont,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>
      </View>

      <View style={[styles.legend, { gap: spacing }]}>
        <View style={[styles.key, { gap: spacing / 4 }]}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor: invertedColor,
                width: barSize,
              },
            ]}
          />

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            Energy
          </Text>
        </View>

        <View style={[styles.key, { gap: spacing / 4 }]}>
          <View style={[styles.dot, { backgroundColor: colors.primary, width: barSize }]} />

          <Text
            style={{
              fontFamily: "Circular-Medium",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            Stress
          </Text>
        </View>
      </View>

      <View style={{ overflow: "hidden" }}>
        <BarChart
          data={data}
          width={
            dimensions.width > dimensions.height
              ? 768 - spacing * 4 - spacing * 2.5
              : dimensions.width - spacing * 4 - spacing * 2.5
          }
          height={Device.deviceType !== 1 ? 112 : 80}
          barWidth={barSize}
          roundedTop
          roundedBottom
          spacing={Device.deviceType !== 1 ? 48 : 16}
          yAxisThickness={0}
          xAxisThickness={0}
          maxValue={100}
          noOfSections={4}
          yAxisLabelWidth={spacing * 2.5}
          yAxisLabelSuffix="%"
          yAxisTextStyle={{
            fontFamily: "Circular-Book",
            fontSize: fontScale >= 1.2 ? extraSmallFont : smallFont,
            color: colors.opaque,
          }}
          yAxisExtraHeight={spacing}
          initialSpacing={spacing / 2}
          rulesColor={colors.primary === "white" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
          disablePress
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  info: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    aspectRatio: "1/1",
    borderRadius: 999,
  },
});
