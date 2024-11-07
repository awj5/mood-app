import { StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { BadgeCheck } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type BigButtonProps = {
  children: string;
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
          height: Device.deviceType !== 1 ? 96 : 72,
          gap: Device.deviceType !== 1 ? 12 : 8,
        },
      ]}
      hitSlop={8}
    >
      <BadgeCheck
        color={colors.primary === "white" ? "black" : "white"}
        size={Device.deviceType !== 1 ? 32 : 24}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
      />

      <Text
        style={[
          styles.text,
          { color: colors.primary === "white" ? "black" : "white", fontSize: Device.deviceType !== 1 ? 24 : 18 },
        ]}
        allowFontScaling={false}
      >
        {props.children}
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
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: "Circular-Bold",
  },
});
