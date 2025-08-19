import { useContext, useEffect, useState } from "react";
import { Platform, View, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { Settings2 } from "lucide-react-native";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import { CompanyFiltersContext, CompanyFiltersContextType } from "context/company-filters";
import HeaderDates from "components/HeaderDates";
import Upsell from "components/company/Upsell";
import Disclaimer from "components/company/Disclaimer";
import Content from "components/company/Content";
import HeaderTitle from "components/HeaderTitle";
import Bg from "components/Bg";
import Button from "components/Button";
import { CompanyCheckInType } from "types";
import { getStoredVal, getTheme } from "utils/helpers";
import { getMonday } from "utils/dates";

export default function Company() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const { companyFilters, setCompanyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>();
  const [company, setCompany] = useState("");

  useEffect(() => {
    (async () => {
      const name = await getStoredVal("company-name");
      const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
      if (name && send) setHasAccess(true);
      if (name) setCompany(name);
    })();

    setCompanyDates({ weekStart: getMonday(), rangeStart: undefined, rangeEnd: undefined }); // Always set date range to current week on mount (UTC)
    setCompanyFilters({ locations: [], teams: [] }); // Reset
  }, []);

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
          headerRight: () => (
            <View style={{ display: hasAccess ? "flex" : "none" }}>
              <HeaderDates dates={companyDates} type="company" />
            </View>
          ),
        }}
      />

      {hasAccess ? (
        <>
          <Bg checkIns={checkIns} />

          <View style={{ flex: 1, marginTop: Platform.OS === "android" ? 106 : headerHeight }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <HeaderTitle text={company} />

              <View
                style={{
                  marginRight: theme.spacing.base,
                  marginTop: theme.spacing.base,
                }}
              >
                <Button
                  icon={Settings2}
                  route="company-filters"
                  count={companyFilters.locations.length + companyFilters.teams.length}
                >
                  Filters
                </Button>
              </View>
            </View>

            <Content checkIns={checkIns} setCheckIns={setCheckIns} company={company} />
          </View>
        </>
      ) : company ? (
        <Disclaimer company={company} setHasAccess={setHasAccess} />
      ) : (
        <Upsell />
      )}
    </View>
  );
}
