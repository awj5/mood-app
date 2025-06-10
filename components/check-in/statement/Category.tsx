import { View, Text, useColorScheme } from "react-native";
import * as Device from "expo-device";
import {
  Compass,
  Waves,
  Users,
  Puzzle,
  LifeBuoy,
  HeartHandshake,
  Scale,
  Blend,
  ListChecks,
  Cog,
  Award,
  Gavel,
  HeartPulse,
  Lightbulb,
} from "lucide-react-native";
import competenciesData from "data/competencies.json";
import { getTheme } from "utils/helpers";

type CategoryProps = {
  id: number;
  foreground: string;
  color: string;
};

export default function Category(props: CategoryProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const category = competenciesData[0].categories.filter((item) => item.id === props.id)[0];
  const title = category.title;

  const icons = {
    Compass,
    Waves,
    Users,
    Puzzle,
    LifeBuoy,
    HeartHandshake,
    Scale,
    Blend,
    ListChecks,
    Cog,
    Award,
    Gavel,
    HeartPulse,
    Lightbulb,
  };

  const Icon = icons[category.icon as keyof typeof icons];

  return (
    <View
      style={{
        gap: theme.spacing.small / 2,
        backgroundColor: props.foreground,
        paddingHorizontal: theme.spacing.small,
        height: theme.spacing.base * 2,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
      }}
    >
      {Icon && (
        <Icon
          color={props.color}
          size={theme.icon.small.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.small.stroke}
        />
      )}

      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: props.color,
          fontSize: theme.fontSize.xSmall,
          textTransform: "uppercase",
        }}
        allowFontScaling={false}
      >
        {title}
      </Text>
    </View>
  );
}
