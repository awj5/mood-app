import { View, Text, useColorScheme } from "react-native";
import { getTheme } from "utils/helpers";

type TextBlockProps = {
  title: string;
  text: string;
  background: string;
  color: string;
};

export default function TextBlock(props: TextBlockProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        backgroundColor: props.background,
        borderRadius: theme.spacing.base,
        padding: theme.spacing.small * 2,
        gap: theme.spacing.base / 2,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          fontSize: theme.fontSize.small,
          color: props.color,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <Text
        style={{
          fontSize: theme.fontSize.small,
          color: props.color,
          fontFamily: "Circular-Book",
          textAlign: "center",
        }}
      >
        {props.text}
      </Text>
    </View>
  );
}
