import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Lightbulb } from "lucide-react-native";
import { CheckInType } from "data/database";
import { theme } from "utils/helpers";

type FactProps = {
  checkIns: CheckInType[];
};

export default function Fact(props: FactProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View style={{ flex: 1, opacity, gap: Device.deviceType !== 1 ? 12 : 8 }}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        <Lightbulb
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 18 : 14,
          }}
          allowFontScaling={false}
        >
          DID YOU KNOW?
        </Text>
      </View>

      <View
        style={{
          aspectRatio: Device.deviceType !== 1 ? "2/1" : "4/4",
          backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing,
          gap: spacing,
        }}
      >
        <Text
          style={{
            fontFamily: "Circular-Black",
            color: colors.primary !== "white" ? "white" : "black",
            fontSize: Device.deviceType !== 1 ? 24 : 18,
            lineHeight: Device.deviceType !== 1 ? 26 : 20,
          }}
          allowFontScaling={false}
        >
          Exercise releases feel-good chemicals like endorphins & serotonin.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
