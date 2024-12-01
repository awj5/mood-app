import { StyleSheet, View, Pressable, Text } from "react-native";
import * as Device from "expo-device";
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
      <Text style={textStyle} allowFontScaling={false}>
        Your conversations are always private.
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
    gap: 4,
  },
});
