import { useEffect } from "react";
import { View, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { theme } from "utils/helpers";

type EventsProps = {
  checkIns: CheckInType[];
};

export default function Events(props: EventsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        flex: 1,
        aspectRatio: Device.deviceType !== 1 ? "4/3" : "4/4",
        backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        opacity,
      }}
    >
      <View style={{ padding: spacing }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary === "white" ? "black" : "white",
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          KEY MOMENTS
        </Text>
      </View>
    </Animated.View>
  );
}
