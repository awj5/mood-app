import { StyleSheet, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { CalendarDays } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type ButtonProps = {
  text: string;
  func: () => void;
  fill?: boolean;
  icon?: string;
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
          backgroundColor: props.fill ? colors.primary : "transparent",
          gap: Device.deviceType !== 1 ? 10 : 6,
        },
      ]}
      hitSlop={8}
    >
      {props.icon && props.icon === "calendar" && (
        <CalendarDays
          color={!props.fill ? colors.primary : colors.primary === "white" ? "black" : "white"}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
        />
      )}

      <Text
        style={[
          styles.text,
          {
            color: !props.fill ? colors.primary : colors.primary === "white" ? "black" : "white",
            fontSize: Device.deviceType !== 1 ? 24 : 16,
          },
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: "Circular-Medium",
  },
});
