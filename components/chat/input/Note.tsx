import { StyleSheet, View, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { ShieldCheck } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

export default function Note() {
  const colors = theme();

  const textStyle = {
    fontFamily: "Circular-Book",
    color: colors.secondary,
    fontSize: Device.deviceType !== 1 ? 18 : 14,
  };

  return (
    <View style={styles.container}>
      <ShieldCheck
        color={colors.secondary}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />

      <Text style={textStyle} allowFontScaling={false}>
        Your conversations are private.
      </Text>

      <Pressable
        onPress={() => alert("Coming soon")}
        style={({ pressed }) => [pressedDefault(pressed), { flexDirection: "row" }]}
        hitSlop={8}
      >
        <Text style={[textStyle, { textDecorationLine: "underline" }]} allowFontScaling={false}>
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
    gap: 4,
  },
});
