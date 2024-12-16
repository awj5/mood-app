import { StyleSheet, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { CalendarDays, BellRing } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type ButtonProps = {
  children: string;
  func?: () => void;
  fill?: boolean;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
};

export default function Button(props: ButtonProps) {
  const colors = theme();
  const stroke = Device.deviceType !== 1 ? 2 : 1.5;

  return (
    <Pressable
      onPress={() => props.func && props.func()}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          height: Device.deviceType !== 1 ? (props.fill ? 64 : 48) : props.fill ? 48 : 36,
          paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
          borderWidth: props.destructive || props.fill ? 0 : stroke,
          borderColor: colors.primary,
          backgroundColor: props.destructive ? colors.secondary : props.fill ? colors.primary : "transparent",
          gap: Device.deviceType !== 1 ? 10 : 6,
        },
        props.disabled && { opacity: 0.25 },
      ]}
      disabled={props.disabled}
      hitSlop={8}
    >
      {props.icon && props.icon === "calendar" ? (
        <CalendarDays
          color={!props.fill ? colors.primary : colors.primary === "white" ? "black" : "white"}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={stroke}
        />
      ) : (
        props.icon &&
        props.icon === "bell" && (
          <BellRing
            color={!props.fill ? colors.primary : colors.primary === "white" ? "black" : "white"}
            size={Device.deviceType !== 1 ? 28 : 20}
            absoluteStrokeWidth
            strokeWidth={stroke}
          />
        )
      )}

      <Text
        style={{
          fontFamily: "Circular-Medium",
          color: props.destructive
            ? "white"
            : !props.fill
            ? colors.primary
            : colors.primary === "white"
            ? "black"
            : "white",
          fontSize: Device.deviceType !== 1 ? 20 : 16,
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
