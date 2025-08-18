import { View, useColorScheme, Text } from "react-native";
import { getTheme } from "utils/helpers";

type StatementProps = {
  text: string;
  average: number;
  count: number;
};

export default function Statement(props: StatementProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
          color: theme.color.primary,
          width: "75%",
        }}
        allowFontScaling={false}
      >
        {props.text.charAt(0).toUpperCase() + props.text.slice(1)}
      </Text>

      <View style={{ alignItems: "center", width: "25%" }}>
        <Text
          style={{
            fontFamily: "Circular-Medium",
            fontSize: theme.fontSize.xLarge,
            color: theme.color.primary,
          }}
          allowFontScaling={false}
        >
          {props.average}%
        </Text>

        <Text
          style={{
            fontFamily: "Circular-Book",
            fontSize: theme.fontSize.xxSmall,
            color: theme.color.opaque,
          }}
          allowFontScaling={false}
        >
          {props.count} USERS
        </Text>
      </View>
    </View>
  );
}
