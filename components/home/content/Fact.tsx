import { useContext, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Footprints } from "lucide-react-native";
import { CheckInType } from "data/database";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { theme } from "utils/helpers";

type FactProps = {
  checkIns: CheckInType[];
};

export default function Fact(props: FactProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      <View
        style={{
          aspectRatio: Device.deviceType !== 1 ? "5/3" : "4/4",
          backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing,
          gap: spacing / 2,
        }}
      >
        <View style={styles.header}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary !== "white" ? "white" : "black",
              fontSize: Device.deviceType !== 1 ? 16 : 12,
            }}
            allowFontScaling={false}
          >
            DID YOU KNOW?
          </Text>

          <Footprints
            color={colors.primary !== "white" ? "white" : "black"}
            size={Device.deviceType !== 1 ? 32 : 24}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
          />
        </View>

        <Text
          style={{
            fontFamily: "Circular-Black",
            color: colors.primary !== "white" ? "white" : "black",
            fontSize: Device.deviceType !== 1 ? 24 : dimensions.width > 375 ? 18 : 16, // Smaller for iPhone SE
            lineHeight: Device.deviceType !== 1 ? 26 : dimensions.width > 375 ? 20 : 18, // Smaller for iPhone SE
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
