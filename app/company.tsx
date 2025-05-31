import { useContext, useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
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
  const { companyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>();
  const [company, setCompany] = useState("");

  useEffect(() => {
    (async () => {
      const uuid = await getStoredVal("uuid"); // Is customer employee
      const name = await getStoredVal("company-name");
      const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
      if (name) setCompany(name);
      if (uuid && name && send) setHasAccess(true);
    })();

    // Always set date range to past 90 days on mount (UTC)
    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    today.setHours(0, 0, 0, 0);
    const daysAgo = new Date(today);
    daysAgo.setDate(today.getDate() - 90);

    setCompanyDates({
      weekStart: getMonday(daysAgo),
      rangeStart: daysAgo,
      rangeEnd: today,
      title: "PAST 90 DAYS'",
    });
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
          headerRight: () => (hasAccess ? <HeaderDates dates={companyDates} type="company" /> : null),
        }}
      />

      {hasAccess ? (
        <>
          <Bg checkIns={checkIns} topOffset={Device.deviceType === 1 ? 96 : 128} />

          <View style={{ flex: 1, marginTop: headerHeight }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <HeaderTitle text={company} />

              <View
                style={{
                  paddingRight: theme.spacing.base,
                  paddingTop: theme.spacing.base,
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

            <Content checkIns={checkIns} setCheckIns={setCheckIns} filters={companyFilters} />
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
