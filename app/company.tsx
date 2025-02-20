import { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import HeaderDates from "components/HeaderDates";
import Upsell from "components/company/Upsell";
import Disclaimer from "components/company/Disclaimer";
import { getStoredVal, theme } from "utils/helpers";
import { getMonday } from "utils/dates";

export default function Company() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [hasAccess, setHasAccess] = useState(false);
  const [company, setCompany] = useState("");

  const checkAccess = async () => {
    const name = await getStoredVal("company-name");
    const send = await getStoredVal("send-check-ins"); // Has agreed to send check-ins to company insights
    if (name) setCompany(name);
    if (name && send) setHasAccess(true);
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
          headerRight: () => (hasAccess ? <HeaderDates dates={companyDates} type="company" /> : null),
        }}
      />

      {hasAccess ? <></> : company ? <Disclaimer company={company} /> : <Upsell />}
    </View>
  );
}

const styles = StyleSheet.create({
  //
});
