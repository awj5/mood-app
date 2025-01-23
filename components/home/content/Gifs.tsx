import { useEffect } from "react";
import { Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { theme } from "utils/helpers";

type GifsProps = {
  checkIns: CheckInType[];
};

export default function Gifs(props: GifsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
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
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
        allowFontScaling={false}
      >
        RELATABLE MEMES
      </Text>
    </Animated.View>
  );
}
