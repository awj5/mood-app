import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import MoodsData from "data/moods.json";
import { CheckInMoodType, CheckInType } from "data/database";
import Gauge from "./Burnout/Gauge";
import { pressedDefault, theme } from "utils/helpers";

type BurnoutProps = {
  checkIns: CheckInType[];
};

export default function Burnout(props: BurnoutProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [value, setValue] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;

  useEffect(() => {
    // Get mood scores
    const stress = [];
    const energy = [];

    // Loop check-ins and get mood stress and energy scores
    for (let i = 0; i < props.checkIns.length; i++) {
      let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
      energy.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
      stress.push(MoodsData.filter((item) => item.id === mood.color)[0].stress);
    }

    // Calculate averages and burnout risk
    const avgEnergy = energy.reduce((sum, num) => sum + num, 0) / energy.length;
    const avgStress = stress.reduce((sum, num) => sum + num, 0) / stress.length;
    const risk = Math.round((avgStress + (100 - avgEnergy)) / 2); // Out of 100
    setValue(-90 + (180 * risk) / 100); // Convert to rotation range
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.opaqueBg,
        borderRadius: spacing,
        opacity,
      }}
    >
      <View style={[styles.wrapper, { padding: spacing }]}>
        <View style={[styles.header, { gap: spacing / 4 }]}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            BURNOUT RISK
          </Text>

          <Text
            style={{
              fontFamily: "Circular-Book",
              marginTop: Device.deviceType !== 1 ? -2 : -1,
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 12 : 8,
            }}
            allowFontScaling={false}
          >
            BETA
          </Text>
        </View>

        <Gauge value={value} />

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/mood-levels/")}
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
              fontSize: fontSize,
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

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
});
