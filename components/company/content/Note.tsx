import { StyleSheet, View, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import { ShieldCheck } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

export default function Note() {
  const colors = theme();

  const textStyle = {
    fontFamily: "Circular-Book",
    color: colors.primary,
    fontSize: Device.deviceType !== 1 ? 18 : 14,
  };

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 6 : 4 }]}>
      <ShieldCheck
        color={colors.primary}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />

      <Text style={textStyle} allowFontScaling={false}>
        All check-in data is <Text style={{ fontFamily: "Circular-Bold" }}>anonymous</Text>.
      </Text>

      <Pressable
        onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy")}
        style={({ pressed }) => [pressedDefault(pressed), { flexDirection: "row" }]}
        hitSlop={8}
      >
        <Text style={[textStyle, { color: colors.primary, textDecorationLine: "underline" }]} allowFontScaling={false}>
          Learn more
        </Text>

        <Text style={textStyle} allowFontScaling={false}>
          .
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
