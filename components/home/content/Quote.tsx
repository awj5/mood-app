import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated from "react-native-reanimated";
import { MessageSquareQuote, Share } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

export default function Quote() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const stroke = Device.deviceType !== 1 ? 2 : 1.5;
  const iconSize = Device.deviceType !== 1 ? 28 : 20;

  return (
    <Animated.View style={[styles.container, { gap: Device.deviceType !== 1 ? 12 : 10 }]}>
      <View style={styles.header}>
        <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
          <MessageSquareQuote color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
            }}
            allowFontScaling={false}
          >
            WORDS OF WISDOM
          </Text>
        </View>

        <Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => [pressedDefault(pressed)]} hitSlop={8}>
          <Share color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={stroke} />
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing,
          gap: spacing,
        }}
      >
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          “If you are working on something exciting that you really care about, you don't have to be pushed. The vision
          pulls you.”
        </Text>

        <Text
          style={{
            fontFamily: "Circular-Medium",
            color: colors.primary,
            fontSize: fontSize,
            alignSelf: "flex-end",
          }}
          allowFontScaling={false}
        >
          — Steve Jobs
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 672 + 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
