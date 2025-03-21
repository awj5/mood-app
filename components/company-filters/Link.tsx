import { StyleSheet, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { ChevronRight } from "lucide-react-native";
import { theme, pressedDefault } from "utils/helpers";

type LinkProps = {
  title: string;
};

export default function Link(props: LinkProps) {
  const colors = theme();
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  return (
    <Pressable onPress={() => null} style={({ pressed }) => [pressedDefault(pressed), styles.container]} hitSlop={16}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <ChevronRight
        color={colors.primary}
        size={Device.deviceType !== 1 ? 28 : 20}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
