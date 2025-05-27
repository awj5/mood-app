import { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
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
import { getStoredVal, theme } from "utils/helpers";
import { getMonday } from "utils/dates";

export default function Company() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const { companyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>(); // !!!!!!!!!!!!! Why can't I use an empty array so I don't need Bg prop to support undefined
  const [company, setCompany] = useState("");
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const checkAccess = async () => {
    const uuid = await getStoredVal("uuid");
    const name = await getStoredVal("company-name");
    const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
    if (name) setCompany(name);
    if (uuid && name && send) setHasAccess(true);
  };

  useEffect(() => {
    checkAccess();

    // Always set date to past 30 days on mount (UTC)
    const today = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
    today.setHours(0, 0, 0, 0);
    const daysAgo = new Date();
    daysAgo.setHours(0, 0, 0, 0);
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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => <HeaderDates dates={companyDates} type="company" hidden={!hasAccess} />,
        }}
      />

      {hasAccess ? (
        <>
          <Bg checkIns={checkIns} topOffset={Device.deviceType === 1 ? 96 : 128} />

          <View style={{ flex: 1, marginTop: headerHeight }}>
            <View style={styles.header}>
              <HeaderTitle text={company} />

              <View
                style={{
                  paddingRight: spacing,
                  paddingTop: spacing,
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
