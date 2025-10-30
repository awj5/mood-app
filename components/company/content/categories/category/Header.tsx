import { View, Text, useColorScheme } from "react-native";
import { getTheme } from "utils/helpers";

type HeaderProps = {
  title: string;
  icon: React.ElementType;
  focused: boolean;
};

export default function Header(props: HeaderProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const Icon = props.icon;

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: theme.spacing.base / 8 }}>
      <Text
        style={{
          fontSize: theme.fontSize.xSmall,
          color: props.focused ? theme.color.inverted : theme.color.primary,
          fontFamily: "Circular-Bold",
          textTransform: "uppercase",
          flex: 1,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <Icon
        color={props.focused ? theme.color.inverted : theme.color.primary}
        size={theme.icon.large.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.large.stroke}
      />
    </View>
  );
}
