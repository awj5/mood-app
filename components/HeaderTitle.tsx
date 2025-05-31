import { View, Text, useColorScheme } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { getTheme } from "utils/helpers";

type HeaderTitleProps = {
  text: string;
  description?: string;
  transparentHeader?: boolean;
};

export default function HeaderTitle(props: HeaderTitleProps) {
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        padding: theme.spacing.base,
        gap: theme.spacing.base / 2,
        marginTop: props.transparentHeader ? headerHeight : 0,
        flexShrink: 1, // Needed for when placed in a flex row
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Black",
          fontSize: props.text.length > 12 ? theme.fontSize.xLarge : theme.fontSize.xxxLarge,
          color: theme.color.primary,
        }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>

      {props.description && (
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: theme.color.secondary,
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          {props.description}
        </Text>
      )}
    </View>
  );
}
