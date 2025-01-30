import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Info } from "lucide-react-native";
import MoodsData from "data/moods.json";
import { CheckInType, CheckInMoodType } from "data/database";
import Title from "./Stats/Title";
import Bar from "./Stats/Bar";
import { theme, pressedDefault } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [energy, setEnergy] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;

  useEffect(() => {
    // Get mood scores
    const satisfaction = [];
    const energy = [];

    // Loop check-ins and get mood satisfaction and energy scores
    for (let i = 0; i < props.checkIns.length; i++) {
      let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
      satisfaction.push(MoodsData.filter((item) => item.id === mood.color)[0].satisfaction);
      energy.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
    }

    // Calculate averages
    setSatisfaction(Math.floor(satisfaction.reduce((sum, num) => sum + num, 0) / satisfaction.length));
    setEnergy(Math.floor(energy.reduce((sum, num) => sum + num, 0) / energy.length));

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

      <View style={{ flexDirection: "row", gap: spacing / 2 }}>
        <View style={{ gap: spacing / 2 }}>
          <Title>Satisfaction</Title>
          <Title>Energy</Title>
        </View>

        <View style={{ flex: 1, gap: spacing / 2 }}>
          <Bar stat={satisfaction} />
          <Bar stat={energy} />
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
});
