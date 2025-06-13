import { View, Text, useColorScheme } from "react-native";
import competenciesData from "data/competencies.json";
import { getTheme } from "utils/helpers";

type AboutProps = {
  id: number;
  title: string;
};

export default function About(props: AboutProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const description = competenciesData[0].categories.filter((item) => item.id === props.id)[0].description;

  return (
    <View
      style={{
        backgroundColor: theme.color.invertedOpaqueBg,
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
          color: theme.color.inverted,
        }}
        allowFontScaling={false}
      >
        {`WHAT'S ${props.title}?`}
      </Text>

      <Text
        style={{
          fontSize: theme.fontSize.small,
          color: theme.color.inverted,
          fontFamily: "Circular-Book",
          textAlign: "center",
        }}
      >
        {description}
      </Text>
    </View>
  );
}
