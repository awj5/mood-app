import { StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { pressedDefault, theme } from "utils/helpers";

type BigButtonProps = {
  text: string;
  route: string;
};

export default function BigButton(props: BigButtonProps) {
  const router = useRouter();
  const colors = theme();

  return (
    <Pressable
      onPress={() => router.push(props.route)}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          backgroundColor: colors.primary,
          paddingVertical: Device.deviceType !== 1 ? 24 : 20,
          paddingHorizontal: Device.deviceType !== 1 ? 28 : 24,
        },
      ]}
      hitSlop={8}
    >
      <Text
        style={[
          styles.text,
          { color: colors.primary === "white" ? "black" : "white", fontSize: Device.deviceType !== 1 ? 24 : 18 },
        ]}
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
    width: "100%",
    maxWidth: 448,
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Bold",
  },
});
