import { StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { FadeIn } from "react-native-reanimated";
import { theme } from "utils/helpers";

export default function Recs() {
  const colors = theme();

  return (
    <Animated.View entering={FadeIn} style={{ gap: Device.deviceType !== 1 ? 6 : 4 }}>
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 18 : 14,
        }}
        allowFontScaling={false}
      >
        RECOMMENDATIONS
      </Text>

      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            opacity: 0.5,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
        allowFontScaling={false}
      >
        Coming soon
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
