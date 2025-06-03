import { View, Text, ActivityIndicator, useColorScheme } from "react-native";
import { getTheme } from "utils/helpers";

type LoadingProps = {
  text: string;
};

export default function Loading(props: LoadingProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
      <ActivityIndicator color={theme.color.primary} />

      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </View>
  );
}
