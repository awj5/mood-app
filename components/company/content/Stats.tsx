import { useContext, useEffect, useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import moodsData from "data/moods.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { StatsDataType } from "../Content";
import Stat from "./stats/Stat";
import Participation from "./stats/Participation";
import { CompanyCheckInType } from "types";
import { getMostCommon, getTheme } from "utils/helpers";
import { groupCheckIns } from "utils/data";

type StatsProps = {
  checkIns: CompanyCheckInType[];
  role: string;
  statsData?: StatsDataType;
};

export default function Stats(props: StatsProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [moodData, setMoodData] = useState<pieDataItem[]>([]);
  const chartSize = Device.deviceType === 1 ? 144 : 200;

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const press = (color: string) => {
    router.push({
      pathname: "mood",
      params: {
        name: color,
      },
    });
  };

  useEffect(() => {
    const moods: Record<string, number> = {};
    const grouped = groupCheckIns(props.checkIns); // Group by user and week

    // Loop users
    for (const [, weeks] of Object.entries(grouped)) {
      // Loop weeks
      for (const [, checkIns] of Object.entries(weeks)) {
        const checkInMoods = [];

        // Loop check-ins
        for (const checkIn of checkIns) {
          checkInMoods.push(checkIn.value.color);
        }

        const mood = getMostCommon(checkInMoods);
        if (!moods[mood]) moods[mood] = 0; // Create mood if doesn't exist
        moods[mood] += 1; // Add count for mood
      }
    }

    const total = Object.values(moods).reduce((sum, value) => sum + value, 0); // Combined mood count
    const moodData: pieDataItem[] = [];

    Object.entries(moods).forEach(([key, value]) => {
      const mood = moodsData.filter((item) => item.id === Number(key))[0];

      moodData.push({
        value: value,
        color: mood.color,
        text: (value / total) * 100 >= 8 ? ((value / total) * 100).toFixed(0) + "%" : "",
        tooltipText: mood.name,
        shiftTextX: -4,
        shiftTextY: 4,
        textColor: Number(key) >= 6 && Number(key) <= 11 ? "white" : "black",
        onPress: () => press(mood.name),
      });
    });

    moodData.sort((a, b) => b.value - a.value); // Highest first
    const topMoods = moodData.slice(0, 7);
    const otherMoods = moodData.slice(7);

    if (otherMoods.length > 0) {
      const otherTotal = otherMoods.reduce((sum, item) => sum + item.value, 0);

      topMoods.push({
        value: otherTotal,
        color: "white",
        text:
          (otherTotal / props.checkIns.length) * 100 >= 8
            ? ((otherTotal / props.checkIns.length) * 100).toFixed(0) + "%"
            : "",
        tooltipText: "Other",
        shiftTextX: -4,
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
        animatedStyles,
        {
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
          gap: theme.spacing.base,
          backgroundColor: theme.color.invertedBg,
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontSize: theme.fontSize.xSmall,
              fontFamily: "Circular-Bold",
              color: theme.color.inverted,
            }}
            allowFontScaling={false}
          >
            MOOD SNAPSHOT
          </Text>

          <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                gap:
                  dimensions.width <= 375
                    ? theme.spacing.base / 2
                    : Device.deviceType === 1
                    ? theme.spacing.base
                    : theme.spacing.base * 2,
              }}
            >
              <View style={{ gap: theme.spacing.base / 2 }}>
                {moodData.slice(0, 4).map((item) => (
                  <Stat key={item.tooltipText} text={item.tooltipText as string} />
                ))}
              </View>

              <View style={{ gap: theme.spacing.base / 2 }}>
                {moodData.slice(4, 8).map((item) => (
                  <Stat key={item.tooltipText} text={item.tooltipText as string} />
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: chartSize, alignItems: "center", width: "50%" }}>
          <PieChart
            data={moodData}
            donut
            radius={chartSize / 2}
            showText
            font="Circular-Book"
            textSize={theme.fontSize.xSmall}
            labelsPosition="outward"
            innerCircleColor={theme.color.invertedBg}
          />
        </View>
      </View>

      <Participation role={props.role} statsData={props.statsData} />
    </Animated.View>
  );
}
