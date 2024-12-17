import { View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { Sparkles } from "lucide-react-native";
import { theme } from "utils/helpers";

type InsightsProps = {
  text: string;
};

export default function Insights(props: InsightsProps) {
  const colors = theme();

  return (
    <View style={{ gap: Device.deviceType !== 1 ? 6 : 4 }}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        <Sparkles
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
          INSIGHTS
        </Text>
      </View>

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 20 : 16,
        }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
