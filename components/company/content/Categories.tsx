import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
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
import { CategoryType } from "app/category";
import Category from "./categories/Category";
import { CompanyCheckInType } from "types";
import { getMostCommon, getTheme } from "utils/helpers";

type CategoriesProps = {
  checkIns: CompanyCheckInType[];
  role: string;
};

export default function Categories(props: CategoriesProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [categories, setCategories] = useState<CategoryType[]>();

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

  useEffect(() => {
    const groups: Record<string, CompanyCheckInType[]> = {};

    // Loop all check-ins and group into categories
    for (const checkIn of props.checkIns) {
      const category = Math.trunc(checkIn.value.competency);
      if (!groups[category]) groups[category] = []; // Create category if doesn't exist
      groups[category].push(checkIn);
    }

    const list: CategoryType[] = [];

    // Loop groups and get category details
    Object.entries(groups).forEach(([key, value]) => {
      const category = competenciesData[0].categories.filter((item) => item.id === Number(key))[0];
      const moods: number[] = [];
      const responses: number[] = [];

      // Loop category check-ins to get mood and statement response
      value.forEach((checkIn) => {
        moods.push(checkIn.value.color);
        responses.push(checkIn.value.statementResponse);
      });

      const mood = getMostCommon(moods); // Get most common mood in check-ins
      const score = Math.round((responses.reduce((sum, num) => sum + num, 0) / responses.length) * 100); // Average response

      // Determine trend of responses
      let increases = 0;
      let decreases = 0;

      for (let i = 1; i < responses.length; i++) {
        if (responses[i] > responses[i - 1]) {
          increases++;
        } else if (responses[i] < responses[i - 1]) {
          decreases++;
        }
      }

      const trend = increases > decreases ? "increasing" : decreases > increases ? "decreasing" : "stable";

      list.push({
        id: Number(key),
        title: category.title,
        icon: icons[category.icon as keyof typeof icons],
        mood: mood,
        score: score,
        trend: trend,
        checkIns: value,
      });
    });

    list.sort((a, b) => b.score - a.score); // Sort by score in descending order
    setCategories(list);
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{ gap: theme.spacing.base, flexDirection: "row", flexWrap: "wrap" }}
    >
      {categories?.map((item) => (
        <Category key={item.id} data={item} role={props.role} />
      ))}
    </Animated.View>
  );
}
