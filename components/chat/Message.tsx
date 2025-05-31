import { Text, useColorScheme } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { getTheme } from "utils/helpers";

type MessageProps = {
  text: string;
};

export default function Message(props: MessageProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <Animated.View
      style={{
        margin: theme.spacing.base,
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.base / 2,
        backgroundColor: theme.color.secondaryBg,
        borderRadius: theme.spacing.small * 2,
        alignSelf: "flex-end",
        maxWidth: 512,
      }}
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
    >
      <Text
        style={{
          fontFamily: "Circular-Book",
          color: theme.color.primary,
          fontSize: theme.fontSize.body,
        }}
      >
        {props.text}
      </Text>
    </Animated.View>
  );
}
