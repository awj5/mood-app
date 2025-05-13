import { StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Crown } from "lucide-react-native";
import { theme } from "utils/helpers";

type RoleProps = {
  text: string;
};

export default function Role(props: RoleProps) {
  const colors = theme();

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={[
        styles.container,
        {
          gap: Device.deviceType !== 1 ? 10 : 6,
          backgroundColor: colors.primary === "white" ? "black" : "white",
          paddingHorizontal: Device.deviceType !== 1 ? 16 : 12,
          paddingVertical: Device.deviceType !== 1 ? 8 : 6,
        },
      ]}
    >
      <Crown
        color={colors.primary}
        size={Device.deviceType !== 1 ? 20 : 16}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
      />

      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: colors.primary,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
        allowFontScaling={false}
      >
        VIEWING AS {props.text.toUpperCase()}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    alignSelf: "center",
  },
});
