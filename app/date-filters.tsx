import { useContext } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Range from "components/date-filters/Range";
import Shortcuts from "components/date-filters/Shortcuts";
import HeaderTitle from "components/HeaderTitle";
import { pressedDefault, getTheme } from "utils/helpers";

export default function DateFilters() {
  const params = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text
                style={{
                  fontFamily: "Circular-Bold",
                  fontSize: theme.fontSize.body,
                  color: theme.color.link,
                }}
                allowFontScaling={false}
              >
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <HeaderTitle
        text="History"
        description={
          params.type === "company"
            ? "Explore the anonymous mood check-in history of your company by selecting a specific date range or tapping a shortcut."
            : "Explore your mood check-in history by selecting a specific date range or tapping a shortcut."
        }
      />

      <View
        style={[
          {
            padding: theme.spacing.base,
            gap: theme.spacing.base * 2,
          },
        ]}
      >
        <Range
          dates={params.type === "company" ? companyDates : homeDates}
          setDates={params.type === "company" ? setCompanyDates : setHomeDates}
        />

        <Shortcuts setDates={params.type === "company" ? setCompanyDates : setHomeDates} />
      </View>
    </View>
  );
}
