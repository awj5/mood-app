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
import { getTheme } from "utils/helpers";
import { groupCheckIns } from "utils/data";

type CategoriesProps = {
  checkIns: CompanyCheckInType[];
  availableCategories: number[];
  role: string;
};

export default function Categories(props: CategoriesProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [categoriesData, setCategoriesData] = useState<CategoryType[]>();

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
    const categoriesRecord: Record<string, CompanyCheckInType[]> = {};

    // Loop all check-ins and group into categories
    for (const checkIn of props.checkIns) {
      const category = Math.trunc(checkIn.value.competency);

      // Only display categories company has enabled
      if (props.availableCategories.includes(category)) {
        if (!categoriesRecord[category]) categoriesRecord[category] = []; // Create category if doesn't exist
        categoriesRecord[category].push(checkIn);
      }
    }

    const categories: CategoryType[] = [];

    Object.entries(categoriesRecord).forEach(([key, value]) => {
      const category = competenciesData[0].categories.filter((item) => item.id === Number(key))[0];
      const groupedCheckIns = groupCheckIns(value); // Group by user and week
      const responses: number[] = [];

      // Loop users to get statement responses
      for (const [, weeks] of Object.entries(groupedCheckIns)) {
        // Loop weeks
        for (const [, checkIns] of Object.entries(weeks)) {
          const checkInResponses = [];

          // Loop check-ins
          for (const checkIn of checkIns) {
            checkInResponses.push(checkIn.value.statementResponse);
          }

          const checkInResponse = checkInResponses.reduce((sum, num) => sum + num, 0) / checkInResponses.length; // Average response from user for week
          responses.push(checkInResponse);
        }
      }

      const score = Math.round((responses.reduce((sum, num) => sum + num, 0) / responses.length) * 100); // Average response for all users

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

      categories.push({
        id: Number(key),
        title: category.title,
        icon: icons[category.icon as keyof typeof icons],
        score: score,
        trend: trend,
        checkIns: value,
      });
    });

    categories.sort((a, b) => b.score - a.score); // Sort by score in descending order
    setCategoriesData(categories);
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}
      style={{ gap: theme.spacing.base, flexDirection: "row", flexWrap: "wrap" }}
    >
      {categoriesData?.map((item) => (
        <Category key={item.id} data={item} role={props.role} />
      ))}
    </Animated.View>
  );
}
