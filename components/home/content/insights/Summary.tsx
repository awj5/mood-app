import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated, { FadeIn } from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type SummaryProps = {
  text: string;
  getInsights: () => Promise<void>;
};

export default function Summary(props: SummaryProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 6 : 4;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  return (
    <Animated.View
      entering={FadeIn}
      style={[
        styles.container,
        {
          gap: spacing,
          justifyContent: !props.text ? "center" : "flex-start",
        },
      ]}
    >
      <View style={[styles.title, { gap: spacing, display: props.text ? "flex" : "none" }]}>
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
        style={[
          styles.summary,
          {
            color: props.text ? colors.primary : colors.primary === "white" ? "#999999" : "#666666",
            fontSize: fontSize,
          },
        ]}
        allowFontScaling={false}
      >
        {props.text ? props.text : "Unable to generate insights at the moment."}
      </Text>

      {!props.text && (
        <Pressable onPress={() => props.getInsights()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
          <Text
            style={[
              styles.button,
              {
                color: colors.primary,
                fontSize: fontSize,
                padding: spacing,
              },
            ]}
            allowFontScaling={false}
          >
            Try again
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  summary: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  button: {
    fontFamily: "Circular-Book",
    textDecorationLine: "underline",
  },
});
