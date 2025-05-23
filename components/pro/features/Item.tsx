import { View, Text, useColorScheme } from "react-native";
import { Check } from "lucide-react-native";
import { getTheme } from "utils/helpers";

type ItemProps = {
  children: string;
};

export default function Item(props: ItemProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
      <Check
        color={theme.color.primary}
        size={theme.icon.base.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.base.stroke}
      />

      <Text
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.body,
          fontFamily: "Circular-Medium",
        }}
        allowFontScaling={false}
      >
        {props.children}
      </Text>
    </View>
  );
}
