import { Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { Crown, Eye } from "lucide-react-native";
import { getTheme } from "utils/helpers";

type RoleProps = {
  text: string;
};

export default function Role(props: RoleProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const Icon = props.text === "admin" ? Crown : Eye;

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{
        gap: theme.spacing.small / 2,
        backgroundColor: theme.color.inverted,
        paddingHorizontal: theme.spacing.small,
        height: Device.deviceType === 1 ? 28 : 36,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
        alignSelf: "center",
      }}
    >
      <Icon
        color={theme.color.primary}
        size={theme.icon.small.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.small.stroke}
      />

      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: theme.color.primary,
          fontSize: theme.fontSize.xSmall,
          textTransform: "uppercase",
        }}
        allowFontScaling={false}
      >
        VIEWING AS {props.text.toUpperCase()}
      </Text>
    </Animated.View>
  );
}
