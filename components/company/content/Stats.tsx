import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import moodsData from "data/moods.json";
import { CompanyCheckInType } from "app/company";
import Stat from "./Stats/Stat";
import { theme } from "utils/helpers";

type StatsProps = {
  checkIns: CompanyCheckInType[];
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [moodData, setMoodData] = useState<pieDataItem[]>([]);
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const bgColor = colors.primary !== "white" ? "#222222" : "#EEEEEE";

  useEffect(() => {
    const groups: Record<string, CompanyCheckInType[]> = {};

    // Loop all check-ins and group into moods
    for (let i = 0; i < props.checkIns.length; i++) {
      let checkIn = props.checkIns[i];
      let mood = checkIn.value.color;
      if (!groups[mood]) groups[mood] = []; // Create mood if doesn't exist
      groups[mood].push(checkIn);
    }

    const moods: pieDataItem[] = [];

    Object.entries(groups).forEach(([key, value]) => {
      let mood = moodsData.filter((item) => item.id === Number(key))[0];

      moods.push({
        value: value.length,
        color: mood.color,
        text: ((value.length / props.checkIns.length) * 100).toFixed(0) + "%",
        tooltipText: mood.name,
        shiftTextX: -2,
        shiftTextY: 4,
        textColor: Number(key) >= 6 && Number(key) <= 11 ? "white" : "black",
      });
    });

    moods.sort((a, b) => b.value - a.value); // Highest first
    const topMoods = moods.slice(0, 7);
    const otherMoods = moods.slice(7);

    if (otherMoods.length > 0) {
      const otherTotal = otherMoods.reduce((sum, item) => sum + item.value, 0);

      topMoods.push({
        value: otherTotal,
        color: colors.secondary,
        text: ((otherTotal / props.checkIns.length) * 100).toFixed(0) + "%",
        tooltipText: "Other",
        shiftTextX: -2,
        shiftTextY: 4,
        textColor: "black",
      });
    }

    setMoodData(topMoods);
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [props.checkIns]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderRadius: spacing,
          padding: spacing,
          opacity,
        },
      ]}
    >
      <View style={{ width: "50%" }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: invertedColor,
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          MOOD SNAPSHOT
        </Text>

        <View style={styles.list}>
          <View
            style={{
              flexDirection: "row",
              gap: Device.deviceType !== 1 ? spacing * 2 : spacing,
            }}
          >
            <View style={{ gap: spacing / 4 }}>
              {moodData.slice(0, 4).map((item, index) => (
                <Stat key={index} text={item.tooltipText as string} color={item.color as string} />
              ))}
            </View>

            <View style={{ gap: spacing / 4 }}>
              {moodData.slice(4, 8).map((item, index) => (
                <Stat key={index} text={item.tooltipText as string} color={item.color as string} />
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.chart, { height: Device.deviceType !== 1 ? 200 : 144 }]}>
        <PieChart
          data={moodData}
          donut
          radius={Device.deviceType !== 1 ? 100 : 72}
          showText
          font="Circular-Medium"
          textSize={Device.deviceType !== 1 ? 14 : 11}
          labelsPosition="outward"
          innerCircleColor={bgColor}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
  },
  list: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  chart: {
    alignItems: "center",
    width: "50%",
  },
});
