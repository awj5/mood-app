import { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { Settings2 } from "lucide-react-native";
import { CheckInMoodType } from "data/database";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import HeaderDates from "components/HeaderDates";
import Upsell from "components/company/Upsell";
import Disclaimer from "components/company/Disclaimer";
import Content from "components/company/Content";
import HeaderTitle from "components/HeaderTitle";
import Bg from "components/Bg";
import Button from "components/Button";
import { getStoredVal, theme } from "utils/helpers";
import { getMonday } from "utils/dates";

export type CompanyCheckInType = {
  id: number;
  value: CheckInMoodType;
  date: Date;
};

export default function Company() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>();
  const [company, setCompany] = useState("");
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const checkAccess = async () => {
    const name = await getStoredVal("company-name");
    const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
    if (name) setCompany(name);
    if (name && send) setHasAccess(true);
  };

  const openFilters = () => {
    router.push("company-filters");
  };

  useEffect(() => {
    checkAccess();

    // Always set date to past 30 days on mount
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAgo = new Date();
    daysAgo.setHours(0, 0, 0, 0);
    daysAgo.setDate(today.getDate() - 30);

    setCompanyDates({
      weekStart: getMonday(daysAgo),
      rangeStart: daysAgo,
      rangeEnd: today,
      title: "PAST 30 DAYS'",
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
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => <HeaderDates dates={companyDates} type="company" hidden={!hasAccess} />,
        }}
      />

      {hasAccess ? (
        <>
          <Bg checkIns={checkIns} />

          <View style={{ flex: 1, marginTop: headerHeight, gap: spacing / 2 }}>
            <View style={styles.header}>
              <HeaderTitle text={company} />

              <View
                style={{
                  paddingRight: spacing,
                  paddingTop: spacing / 2,
                }}
              >
                <Button icon={Settings2} func={openFilters}>
                  Filters
                </Button>
              </View>
            </View>

            <Content checkIns={checkIns} setCheckIns={setCheckIns} />
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
