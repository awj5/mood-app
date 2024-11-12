import { StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { BadgeCheck } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type BigButtonProps = {
  children: string;
  route: string;
  shadow?: boolean;
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
        props.shadow && styles.shadow,
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
        strokeWidth={Device.deviceType !== 1 ? 3.5 : 3}
      />

      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary === "white" ? "black" : "white",
          fontSize: Device.deviceType !== 1 ? 24 : 18,
        }}
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
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
