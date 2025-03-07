import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
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
  LucideIcon,
} from "lucide-react-native";
import guidelinesData from "data/guidelines.json";
import { CompanyCheckInType } from "app/company";
import Category from "./categories/Category";
import { getMostCommon } from "utils/helpers";

export type CategoriesType = {
  id: number;
  title: string;
  icon: LucideIcon;
  mood: number;
  score: number;
  trend: string;
  checkIns: CompanyCheckInType[];
};

type CategoriesProps = {
  checkIns: CompanyCheckInType[];
};

export default function Categories(props: CategoriesProps) {
  const [categories, setCategories] = useState<CategoriesType[]>();

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
    for (let i = 0; i < props.checkIns.length; i++) {
      let checkIn = props.checkIns[i];
      let category = Math.trunc(checkIn.value.competency);
      if (!groups[category]) groups[category] = []; // Create category if doesn't exist
      groups[category].push(checkIn);
    }

    const list: CategoriesType[] = [];

    // Loop groups and get category details
    Object.entries(groups).forEach(([key, value]) => {
      let category = guidelinesData[0].categories.filter((item) => item.id === Number(key))[0];
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
      style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}
    >
      {categories?.map((item, index) => (
        <Category key={index} data={item} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
});
