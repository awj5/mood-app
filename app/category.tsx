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
import guidelinesData from "data/guidelines.json";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import { CompanyCheckInType } from "./company";
import Bg from "components/Bg";
import Insights from "components/Insights";
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
  const params = useLocalSearchParams<{ id: string; checkIns: string; title: string; icon: string }>();
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const description = guidelinesData[0].categories.filter((item) => item.id === Number(params.id))[0].description;

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
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <Bg checkIns={JSON.parse(params.checkIns)} />

      <View style={{ marginTop: headerHeight, flex: 1 }}>
        <View style={[styles.heading, { gap: spacing / 2, padding: spacing }]}>
          <Icon
            color={colors.primary}
            size={Device.deviceType !== 1 ? 40 : 32}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 3 : 2.5}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              fontSize: Device.deviceType !== 1 ? 30 : 24,
              color: colors.primary,
            }}
            allowFontScaling={false}
          >
            {params.title}
          </Text>
        </View>

        <ScrollView>
          <View
            style={[
              styles.wrapper,
              { paddingHorizontal: spacing, paddingBottom: insets.bottom + spacing, gap: spacing },
            ]}
          >
            <Insights checkIns={JSON.parse(params.checkIns)} dates={companyDates} category={Number(params.id)} />

            <View style={{ alignItems: "center", gap: Device.deviceType !== 1 ? 6 : 4 }}>
              <Text
                style={{
                  fontFamily: "Circular-Bold",
                  fontSize: Device.deviceType !== 1 ? 18 : 14,
                  color: colors.primary,
                }}
                allowFontScaling={false}
              >
                {`ABOUT ${params.title.toUpperCase()}`}
              </Text>

              <Text
                style={[
                  styles.text,
                  {
                    fontSize: Device.deviceType !== 1 ? 20 : 16,
                    color: colors.primary,
                  },
                ]}
              >
                {description}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    maxWidth: 720 + 48,
    alignSelf: "center",
    width: "100%",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
