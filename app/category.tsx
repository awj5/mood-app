import { useContext } from "react";
import { View, Text, ScrollView, Platform, useColorScheme } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LucideIcon,
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
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Bg from "components/Bg";
import Article from "components/Article";
import CompanyInsights from "components/CompanyInsights";
import About from "components/category/About";
import Sentiment from "components/category/Sentiment";
import Role from "components/Role";
import Statements from "components/category/Statements";
import { CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";

export type CategoryType = {
  id: number;
  title: string;
  icon: LucideIcon;
  mood: number;
  score: number;
  trend: string;
  checkIns: CompanyCheckInType[];
};

export default function Category() {
  const params = useLocalSearchParams<{
    id: string;
    checkIns: string;
    title: string;
    icon: string;
    score: string;
    trend: string;
    role: string;
  }>();

  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);

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

  const Icon = icons[params.icon as keyof typeof icons];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.back()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
              tintColor={theme.color.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <Bg checkIns={JSON.parse(params.checkIns)} />

      <View style={{ marginTop: Platform.OS === "android" ? 106 : headerHeight, flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            padding: theme.spacing.base,
            paddingBottom: theme.spacing.base + insets.bottom,
            gap: theme.spacing.base,
            maxWidth: 768,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <View style={{ alignItems: "center", gap: theme.spacing.base / 2 }}>
            <Icon
              color={theme.color.primary}
              size={theme.icon.xxLarge.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.xxLarge.stroke}
            />

            <Text
              style={{
                fontFamily: "Circular-Black",
                fontSize: theme.fontSize.xxLarge,
                color: theme.color.primary,
                textAlign: "center",
              }}
              allowFontScaling={false}
            >
              {params.title}
            </Text>
          </View>

          <CompanyInsights checkIns={JSON.parse(params.checkIns)} dates={companyDates} category={Number(params.id)} />
          {params.role !== "user" && <Role text={params.role} />}

          <View style={{ flexDirection: "row", gap: theme.spacing.base }}>
            <Sentiment score={Number(params.score)} trend={params.trend} role={params.role} />
            <Article category={params.id} />
          </View>

          <Statements checkIns={JSON.parse(params.checkIns)} />
          <About id={Number(params.id)} title={params.title.toUpperCase()} />
        </ScrollView>
      </View>
    </View>
  );
}
