import { StyleSheet, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { pressedDefault, theme } from "utils/helpers";

type ButtonProps = {
  text: string;
  func: () => void;
};

export default function Button(props: ButtonProps) {
  const colors = theme();

  return (
    <Pressable
      onPress={() => props.func()}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          paddingVertical: Device.deviceType !== 1 ? 20 : 12,
          borderWidth: Device.deviceType !== 1 ? 2.5 : 2,
          borderColor: colors.primary,
        },
      ]}
      hitSlop={8}
    >
      <Text
        style={[styles.text, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Medium",
  },
});
