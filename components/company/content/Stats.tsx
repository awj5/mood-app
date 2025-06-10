import { useContext, useEffect, useState } from "react";
import { View, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import moodsData from "data/moods.json";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { StatsDataType } from "../Content";
import Stat from "./Stats/Stat";
import Data from "./Stats/Data";
import { CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";

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
  const participationScore = props.statsData?.participation ?? 0;
  const chartSize = Device.deviceType === 1 ? 144 : 200;

  const participation =
    props.role !== "user"
      ? participationScore + "%"
      : participationScore >= 80
      ? "Very high"
      : participationScore >= 60
      ? "High"
      : participationScore >= 40
      ? "Moderate"
      : participationScore >= 20
      ? "Limited"
      : "Low";

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
    const groups: Record<string, CompanyCheckInType[]> = {};

    // Loop all check-ins and group into moods
    for (const checkIn of props.checkIns) {
      const mood = checkIn.value.color;
      if (!groups[mood]) groups[mood] = []; // Create mood if doesn't exist
      groups[mood].push(checkIn);
    }

    const moods: pieDataItem[] = [];

    Object.entries(groups).forEach(([key, value]) => {
      const mood = moodsData.filter((item) => item.id === Number(key))[0];

      moods.push({
        value: value.length,
        color: mood.color,
        text: ((value.length / props.checkIns.length) * 100).toFixed(0) + "%",
        tooltipText: mood.name,
        shiftTextX: -4,
        shiftTextY: 4,
        textColor: Number(key) >= 6 && Number(key) <= 11 ? "white" : "black",
        onPress: () => press(mood.name),
      });
    });

    moods.sort((a, b) => b.value - a.value); // Highest first
    const topMoods = moods.slice(0, 7);
    const otherMoods = moods.slice(7);

    if (otherMoods.length > 0) {
      const otherTotal = otherMoods.reduce((sum, item) => sum + item.value, 0);

      topMoods.push({
        value: otherTotal,
        color: "white",
        text: ((otherTotal / props.checkIns.length) * 100).toFixed(0) + "%",
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
          backgroundColor: "black",
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
          <Text
            style={{
              fontSize: theme.fontSize.xSmall,
              fontFamily: "Circular-Bold",
              color: "white",
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
            innerCircleColor="#000000"
          />
        </View>
      </View>

      <View
        style={{
          gap: theme.spacing.small,
          paddingHorizontal: theme.spacing.small,
          height: theme.spacing.base * 2,
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 999,
          alignSelf: "center",
        }}
      >
        {props.role !== "user" && (
          <>
            <Data number={String(props.statsData?.checkIns)} text="CHECK-INS" />
            <Data number={String(props.statsData?.users)} text="USERS" />
          </>
        )}

        <Data number={participation.toUpperCase()} text="PARTICIPATION" userView={props.role === "user"} />
      </View>
    </Animated.View>
  );
}
