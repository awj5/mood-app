import { useEffect, useState } from "react";
import { View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import MoodsData from "data/moods.json";
import { CheckInType, CheckInMoodType } from "data/database";
import Title from "./Stats/Title";
import Bar from "./Stats/Bar";
import { theme } from "utils/helpers";

type StatsProps = {
  checkIns: CheckInType[];
};

export default function Stats(props: StatsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [energy, setEnergy] = useState(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

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
      }}
    >
      <View style={{ flexDirection: "row", gap: spacing / 2 }}>
        <View style={{ gap: spacing / 2 }}>
          <Title>SATISFACTION</Title>
          <Title>ENERGY</Title>
        </View>

        <View style={{ flex: 1, gap: spacing / 2 }}>
          <Bar stat={satisfaction} />
          <Bar stat={energy} />
        </View>
      </View>
    </Animated.View>
  );
}
