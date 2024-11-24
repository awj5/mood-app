import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Sparkles } from "lucide-react-native";
import { theme } from "utils/helpers";

type InsightsProps = {
  text: string;
};

export default function Insights(props: InsightsProps) {
  const colors = theme();

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 6 : 4 }]}>
        <Sparkles
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{ fontFamily: "Circular-Bold", color: colors.primary, fontSize: Device.deviceType !== 1 ? 18 : 14 }}
          allowFontScaling={false}
        >
          INSIGHTS
        </Text>
      </View>

      <Text
        style={[styles.text, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 512 + 32,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
