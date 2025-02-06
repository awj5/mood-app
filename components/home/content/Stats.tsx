import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, PixelRatio } from "react-native";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import MoodsData from "data/moods.json";
import { CheckInType, CheckInMoodType } from "data/database";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { CalendarDatesType } from "context/home-dates";
import { theme, pressedDefault } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const fontScale = PixelRatio.getFontScale();
  const localization = getLocales();
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [satisfaction, setSatisfaction] = useState<lineDataItem[]>([]);
  const [energy, setEnergy] = useState<lineDataItem[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
  const smallFont = Device.deviceType !== 1 ? 14 : 11;
  const yAxisWidth = Device.deviceType !== 1 ? 52 : 40; // YAxis labels are 35 in width by default
  const maxWidth = 720 + 48; // Max width of content wrapper
  const rulesColor = colors.primary === "white" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const dataPointSize = Device.deviceType !== 1 ? 6 : 4;
  const grey = colors.primary === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const satisfactionData: lineDataItem[] = [];
    const energyData: lineDataItem[] = [];
    const dates: Date[] = [];
    let chartType = "week"; // week, days or months
    let start = new Date(); // Init
    let end = new Date(); // Init

    if (props.dates.rangeStart && props.dates.rangeEnd) {
      // Range
      start = new Date(props.dates.rangeStart);
      end = new Date(props.dates.rangeEnd);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

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

      // Add objects
      satisfactionData.push({
        label:
          chartType === "months" && dates.length > 9 && dates.length <= 12
            ? months[date.getMonth()].charAt(0)
            : chartType === "months"
            ? months[date.getMonth()]
            : chartType === "days" && localization[0].languageTag === "en-US"
            ? `${date.getMonth() + 1}/${date.getDate()}`
            : chartType === "days"
            ? `${date.getDate()}/${date.getMonth() + 1}`
            : days[date.getDay()],
        value: undefined,
      });

      energyData.push({ value: undefined });

      // Get check-ins on label date
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

      let satisfactionScores = [];
      let energyScores = [];

      // Loop check-ins and get mood satisfaction and energy scores
      for (let i = 0; i < checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(checkIns[i].mood);
        satisfactionScores.push(MoodsData.filter((item) => item.id === mood.color)[0].satisfaction);
        energyScores.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
      }

      if (satisfactionScores.length) {
        // Calculate averages and update values
        satisfactionData[i].value = Math.floor(
          satisfactionScores.reduce((sum, num) => sum + num, 0) / satisfactionScores.length
        );

        energyData[i].value = Math.floor(energyScores.reduce((sum, num) => sum + num, 0) / energyScores.length);
      }
    }

    let delay = 0;

    // Hack! - Add delay if data point spacing will change to avoid points stretching
    if (
      (satisfaction.length > 12 && satisfactionData.length <= 12) ||
      (satisfaction.length <= 12 && satisfactionData.length > 12)
    ) {
      // Reset
      setSatisfaction([]);
      setEnergy([]);
      delay = 100;
    }

    const timer = setTimeout(() => {
      setSatisfaction(satisfactionData);
      setEnergy(energyData);
    }, delay);

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    return () => clearTimeout(timer);
  }, [props.checkIns]);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        opacity,
        gap: spacing / 4,
      }}
    >
      <View>
        <View style={{ flexDirection: "row", gap: spacing / 4 }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            MOOD LEVELS
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 12 : 8,
            }}
            allowFontScaling={false}
          >
            BETA
          </Text>
        </View>

        <Pressable
          onPress={() => alert("Coming soon")}
          style={({ pressed }) => [pressedDefault(pressed), styles.info, { gap: spacing / 4 }]}
          hitSlop={16}
        >
          <Info
            color={grey}
            size={Device.deviceType !== 1 ? 24 : 16}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: grey,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: spacing / 2, overflow: "hidden" }}>
        <LineChart
          data={satisfaction}
          data2={energy}
          height={spacing * 4}
          width={
            dimensions.width > maxWidth
              ? maxWidth - spacing * 4 - yAxisWidth
              : dimensions.width - spacing * 4 - yAxisWidth
          }
          endSpacing={spacing / 2} // Hack! - It seems the end spacing gets doubled
          initialSpacing={spacing}
          spacing={
            satisfaction.length > 12
              ? spacing * 2
              : dimensions.width > maxWidth
              ? (maxWidth - spacing * 4 - yAxisWidth - spacing * 2) / (satisfaction.length - 1)
              : (dimensions.width - spacing * 4 - yAxisWidth - spacing * 2) / (satisfaction.length - 1)
          }
          noOfSections={2}
          yAxisLabelSuffix="%"
          roundToDigits={0}
          maxValue={100}
          yAxisExtraHeight={spacing}
          overflowTop={spacing}
          yAxisLabelWidth={yAxisWidth}
          yAxisTextStyle={{
            fontFamily: "Circular-Book",
            fontSize: fontScale > 1 ? smallFont : fontSize,
            color: colors.primary,
            opacity: 0.5,
          }}
          xAxisLabelTextStyle={{
            fontFamily: "Circular-Book",
            fontSize: fontScale > 1 ? smallFont : fontSize,
            color: colors.primary,
            opacity: 0.5,
          }}
          yAxisThickness={0}
          xAxisThickness={0}
          rulesColor={rulesColor}
          rulesThickness={1}
          showReferenceLine1
          referenceLinesOverChartContent={false}
          referenceLine1Position={0}
          referenceLine1Config={{
            color: rulesColor,
            thickness: 1,
          }}
          dataPointsColor1={colors.primary}
          dataPointsColor2={invertedColor}
          dataPointsRadius={dataPointSize}
          color={colors.primary === "white" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
          color2={colors.primary === "white" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)"}
          thickness={dataPointSize}
          interpolateMissingValues={false}
          curved
          disableScroll={satisfaction.length <= 12}
        />

        <View style={[styles.legend, { gap: spacing }]}>
          <View style={[styles.key, { gap: spacing / 4 }]}>
            <View style={[styles.dot, { backgroundColor: colors.primary, width: dataPointSize * 2 }]} />

            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: colors.primary,
                fontSize: fontSize,
              }}
              allowFontScaling={false}
            >
              Satisfaction
            </Text>
          </View>

          <View style={[styles.key, { gap: spacing / 4 }]}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: invertedColor,
                  width: dataPointSize * 2,
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
        </View>
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
