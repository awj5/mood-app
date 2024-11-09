import { StyleSheet, Pressable, Text } from "react-native";
import * as Device from "expo-device";
import { CalendarDays } from "lucide-react-native";
import { pressedDefault, theme } from "utils/helpers";

type ButtonProps = {
  children: string;
  func: () => void;
  fill?: boolean;
  icon?: string;
};

export default function Button(props: ButtonProps) {
  const colors = theme();
  const stroke = Device.deviceType !== 1 ? 2.5 : 2;

  return (
    <Pressable
      onPress={() => props.func()}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        {
          height: Device.deviceType !== 1 ? (props.fill ? 64 : 52) : props.fill ? 48 : 40,
          paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
          borderWidth: stroke,
          borderColor: colors.primary,
          backgroundColor: props.fill ? colors.primary : "transparent",
          gap: Device.deviceType !== 1 ? 12 : 8,
        },
      ]}
      hitSlop={8}
    >
      {props.icon && props.icon === "calendar" && (
        <CalendarDays
          color={!props.fill ? colors.primary : colors.primary === "white" ? "black" : "white"}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={stroke}
        />
      )}

      <Text
        style={[
          styles.text,
          {
            color: !props.fill ? colors.primary : colors.primary === "white" ? "black" : "white",
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
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
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontFamily: "Circular-Medium",
  },
});
