import { View, Text, ScrollView, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { Sparkles } from "lucide-react-native";
import { theme } from "utils/helpers";

type InsightsProps = {
  text: string;
};

export default function Insights(props: InsightsProps) {
  const colors = theme();
  const gap = Device.deviceType !== 1 ? 6 : 4;

  return (
    <View style={{ flex: 1, gap: gap, paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }}>
      <View style={[styles.title, { gap: gap }]}>
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

      <ScrollView style={{ flex: 1 }}>
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: props.text ? colors.primary : colors.primary === "white" ? "#999999" : "#666666",
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        >
          {props.text ? props.text : "Not found"}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
