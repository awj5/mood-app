import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
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
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [satisfaction, setSatisfaction] = useState<lineDataItem[]>([]);
  const [energy, setEnergy] = useState<lineDataItem[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
  const yAxisWidth = Device.deviceType !== 1 ? 48 : 40; // YAxis labels are 35 in width by default
  const maxWidth = 720 + 48; // Max width of content
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const rulesColor = colors.primary === "white" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)";
  const dataPointSize = Device.deviceType !== 1 ? 6 : 4;

  useEffect(() => {
    const satisfaction: lineDataItem[] = [];
    const energy: lineDataItem[] = [];

    for (let i = 0; i < 7; i++) {
      // Get label date
      let date = new Date(props.dates.weekStart);
      date.setDate(props.dates.weekStart.getDate() + i);

      // Add objects
      satisfaction.push({ label: days[date.getDay()], value: undefined });
      energy.push({ value: undefined });

      // Get check-ins on label date
      let checkIns = props.checkIns.filter((item) => {
        let itemDate = new Date(`${item.date}Z`); // Convert to UTC
        itemDate.setHours(0, 0, 0, 0);

        return itemDate.getTime() === date.getTime();
      });

      let satisfactionScores = [];
      let energyScores = [];

      // Loop label date check-ins and get mood satisfaction and energy scores
      for (let i = 0; i < checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
        satisfactionScores.push(MoodsData.filter((item) => item.id === mood.color)[0].satisfaction);
        energyScores.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
      }

      if (satisfactionScores.length) {
        // Calculate averages and update values
        satisfaction[i].value = Math.floor(
          satisfactionScores.reduce((sum, num) => sum + num, 0) / satisfactionScores.length
        );

        energy[i].value = Math.floor(energyScores.reduce((sum, num) => sum + num, 0) / energyScores.length);
      }
    }

    setSatisfaction(satisfaction);
    setEnergy(energy);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        opacity,
        gap: spacing,
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
            color={colors.primary}
            size={Device.deviceType !== 1 ? 24 : 16}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
          />

          <Text
            style={{
              fontFamily: "Circular-Book",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: spacing / 2 }}>
        <LineChart
          data={satisfaction}
          data2={energy}
          height={spacing * 4}
          width={
            dimensions.width > maxWidth
              ? maxWidth - spacing * 4 - yAxisWidth
              : dimensions.width - spacing * 4 - yAxisWidth
          }
          endSpacing={0}
          initialSpacing={spacing}
          spacing={
            dimensions.width > maxWidth
              ? (maxWidth - spacing * 4 - yAxisWidth - spacing * 2) / (satisfaction.length - 1)
              : (dimensions.width - spacing * 4 - yAxisWidth - spacing * 2) / (satisfaction.length - 1)
          }
          noOfSections={2}
          yAxisLabelSuffix="%"
          maxValue={100}
          yAxisLabelWidth={yAxisWidth}
          yAxisTextStyle={{
            fontFamily: "Circular-Medium",
            fontSize: Device.deviceType !== 1 ? 14 : 11,
            color: colors.primary,
            opacity: 0.5,
          }}
          xAxisLabelTextStyle={{
            fontFamily: "Circular-Medium",
            fontSize: Device.deviceType !== 1 ? 14 : 11,
            color: colors.primary,
            opacity: 0.5,
          }}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelsHeight={yAxisWidth / 2}
          xAxisLabelsVerticalShift={Device.deviceType !== 1 ? 10 : 4}
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
          dataPointsColor2={colors.primary === "white" ? "black" : "white"}
          dataPointsRadius1={dataPointSize}
          dataPointsShape2="rectangular"
          dataPointsWidth2={dataPointSize * 2}
          dataPointsHeight2={dataPointSize * 2}
          color={colors.primary === "white" ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"}
          color2={colors.primary === "white" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.6)"}
          thickness={Device.deviceType !== 1 ? 5 : 3}
          disableScroll
          interpolateMissingValues={false}
          curved
        />

        <View style={[styles.legend, { gap: spacing }]}>
          <View style={[styles.key, { gap: spacing / 2 }]}>
            <View style={[styles.dot, { backgroundColor: colors.primary, width: spacing / 2, borderRadius: 999 }]} />

            <Text
              style={{
                fontFamily: "Circular-Book",
                color: colors.primary,
                fontSize: fontSize,
              }}
              allowFontScaling={false}
            >
              Satisfaction
            </Text>
          </View>

          <View style={[styles.key, { gap: spacing / 2 }]}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: colors.primary === "white" ? "black" : "white",
                  width: spacing / 2,
                },
              ]}
            />

            <Text
              style={{
                fontFamily: "Circular-Book",
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
    opacity: 0.5,
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
  },
});
