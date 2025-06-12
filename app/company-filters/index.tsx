import { useContext } from "react";
import { Pressable, ScrollView, Text, View, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import { getLocales } from "expo-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CompanyFiltersContext, CompanyFiltersContextType } from "context/company-filters";
import HeaderTitle from "components/HeaderTitle";
import Link from "components/company-filters/Link";
import { pressedDefault, getTheme } from "utils/helpers";

export default function CompanyFilters() {
  const localization = getLocales();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);

  const dividerStyle = {
    backgroundColor: theme.color.secondaryBg,
    marginVertical: theme.spacing.base,
    width: "100%" as const,
    height: 1,
  };

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
        text="Filters"
        description={`Refine company insights by selecting locations or specific teams within your ${
          localization[0].languageTag === "en-US" ? "organization" : "organisation"
        }.`}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.base,
          paddingBottom: insets.bottom + theme.spacing.base,
        }}
      >
        <Link title="Locations" />
        <View style={dividerStyle} />
        <Link title="Teams" />
        <View style={dividerStyle} />

        {companyFilters.locations.length || companyFilters.teams.length ? (
          <Pressable
            onPress={() => setCompanyFilters({ locations: [], teams: [] })}
            style={({ pressed }) => [
              pressedDefault(pressed),
              {
                alignItems: "center",
              },
            ]}
            hitSlop={16}
          >
            <Text
              style={{
                fontFamily: "Circular-Book",
                fontSize: theme.fontSize.body,
                color: theme.color.link,
              }}
              allowFontScaling={false}
            >
              Clear all
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}
