import { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { SlidersHorizontal } from "lucide-react-native";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Bg from "components/home/Bg";
import HeaderTitle from "components/HeaderTitle";
import HeaderDates from "components/HeaderDates";
import Content from "components/company-dash/Content";
import Button from "components/Button";
import { theme, getMonday } from "utils/helpers";

export default function CompanyDash() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);

  useEffect(() => {
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
          headerRight: () => <HeaderDates dates={companyDates} type="company" />,
        }}
      />

      <Bg />

      <View style={[styles.header, { marginTop: headerHeight, paddingRight: Device.deviceType !== 1 ? 24 : 16 }]}>
        <HeaderTitle text="Acme, Inc." />
        <Button icon={SlidersHorizontal}>Filters</Button>
      </View>

      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
