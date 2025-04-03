import { View, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { pressedDefault, theme } from "utils/helpers";

export default function Footer() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;
  const invertedColor = colors.primary === "white" ? "black" : "white";

  return (
    <View style={{ gap: spacing / 2, alignItems: "center" }}>
      <Text
        style={{
          fontFamily: "Circular-Book",
          color: invertedColor,
          fontSize: fontSize,
        }}
      >
        Billing begins when your free trial ends. Cancel before then and you won't be charged.
      </Text>

      <View style={{ flexDirection: "row", gap: spacing }}>
        <Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
          <Text
            style={{
              fontFamily: "Circular-Book",
              color: invertedColor,
              fontSize: fontSize,
            }}
          >
            Terms
          </Text>
        </Pressable>

        <Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
          <Text
            style={{
              fontFamily: "Circular-Book",
              color: invertedColor,
              fontSize: fontSize,
            }}
          >
            Privacy
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
