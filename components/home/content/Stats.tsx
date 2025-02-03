import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import MoodsData from "data/moods.json";
import { CheckInType, CheckInMoodType } from "data/database";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme, pressedDefault } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [satisfaction, setSatisfaction] = useState<lineDataItem[]>([]);
  const [energy, setEnergy] = useState<lineDataItem[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
  const yAxisWidth = 35; // YAxis labels are 35 in width by default
  const maxWidth = 720 + 48; // Max width of content

  useEffect(() => {
    setSatisfaction([
      { value: 50, label: "Mon" },
      { value: 80, label: "Tue" },
      { value: 90, label: "Wed" },
      { value: 70, label: "Thu" },
      { value: 70, label: "Fri" },
      { value: 10, label: "Sat" },
      { value: 50, label: "Sun" },
    ]);

    setEnergy([
      { value: 20, label: "Mon" },
      { value: 60, label: "Tue" },
      { value: 40, label: "Wed" },
      { value: 30, label: "Thu" },
      { value: 90, label: "Fri" },
      { value: 10, label: "Sat" },
      { value: 50, label: "Sun" },
    ]);

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
            MOOD STATS
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
          noOfSections={2}
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
              ? (maxWidth - spacing * 4 - yAxisWidth - spacing * 2) / 6
              : (dimensions.width - spacing * 4 - yAxisWidth - spacing * 2) / 6
          }
          hideDataPoints={true}
          hideDataPoints2={true}
          color={colors.primary}
          color2={colors.primary === "white" ? "black" : "white"}
          thickness={2}
          thickness2={2}
          yAxisLabelSuffix="%"
          yAxisTextStyle={{
            fontFamily: "Circular-Medium",
            fontSize: Device.deviceType !== 1 ? 14 : 11,
            color: colors.primary,
            opacity: 0.5,
          }}
          yAxisThickness={0}
          xAxisLabelTextStyle={{
            fontFamily: "Circular-Medium",
            fontSize: Device.deviceType !== 1 ? 14 : 11,
            color: colors.primary,
            opacity: 0.5,
          }}
          xAxisThickness={0}
          rulesColor={colors.primary === "white" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
          rulesThickness={1}
          showReferenceLine1
          referenceLine1Position={0}
          referenceLine1Config={{
            color: colors.primary === "white" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)",
            thickness: 1,
          }}
          disableScroll
        />

        <View style={[styles.legend, { gap: spacing }]}>
          <View style={[styles.key, { gap: spacing / 2 }]}>
            <View style={{ backgroundColor: colors.primary, height: 2, width: spacing / 2 }} />

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
              style={{ backgroundColor: colors.primary === "white" ? "black" : "white", height: 2, width: spacing / 2 }}
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
});
