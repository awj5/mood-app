import { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
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
import { CompanyCheckInType } from "./company";
import Bg from "components/Bg";
import Article from "components/Article";
import Insights from "components/Insights";
import About from "components/category/About";
import Sentiment from "components/category/Sentiment";
import { theme } from "utils/helpers";

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
  }>();

  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <Bg checkIns={JSON.parse(params.checkIns)} />

      <View style={{ marginTop: headerHeight, flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            styles.wrapper,
            { padding: spacing, paddingBottom: spacing + insets.bottom, gap: spacing },
          ]}
        >
          <View style={{ alignItems: "center", gap: spacing / 2 }}>
            <Icon
              color={colors.primary}
              size={Device.deviceType !== 1 ? 64 : 48}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 4 : 3.25}
            />

            <Text
              style={{
                fontFamily: "Circular-Black",
                fontSize: Device.deviceType !== 1 ? 30 : 24,
                color: colors.primary,
              }}
              allowFontScaling={false}
            >
              {params.title}
            </Text>
          </View>

          <Insights checkIns={JSON.parse(params.checkIns)} dates={companyDates} category={Number(params.id)} />

          <View style={{ flexDirection: "row", gap: spacing }}>
            <Sentiment score={Number(params.score)} trend={params.trend} />
            <Article competency={params.id} />
          </View>

          <About id={Number(params.id)} title={params.title.toUpperCase()} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 720 + 48,
    alignSelf: "center",
    width: "100%",
  },
});
