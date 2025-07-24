import { Text, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import Button from "components/Button";
import { getTheme } from "utils/helpers";

type NoCheckInsProps = {
  company: string;
  isAdmin: boolean;
};

export default function NoCheckIns(props: NoCheckInsProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{ alignItems: "center", gap: theme.spacing.base * 2 }}
    >
      <Text
        style={{
          color: theme.color.opaque,
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        No check-ins found
      </Text>

      {props.company && props.isAdmin && (
        <Button func={() => router.push("company")}>{`View ${props.company} insights`}</Button>
      )}
    </Animated.View>
  );
}
