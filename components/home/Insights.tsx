import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { theme } from "utils/helpers";

export default function Insights() {
  const colors = theme();

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
      <Text
        style={[styles.title, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
        allowFontScaling={false}
      >
        INSIGHTS
      </Text>

      <Text
        style={[styles.text, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
        allowFontScaling={false}
      >
        Prioritized mental well-being by balancing tasks, taking regular breaks, and practicing mindfulness. Felt more
        focused, less stressed, and maintained a positive outlook all week.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 512 + 32,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  title: {
    fontFamily: "Circular-Bold",
    textAlign: "center",
  },
});
