import { useContext, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { Filter } from "lucide-react-native";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Bg from "components/home/Bg";
import HeaderTitle from "components/HeaderTitle";
import HeaderDates from "components/HeaderDates";
import Content from "components/company-dash/Content";
import { theme, getMonday, pressedDefault } from "utils/helpers";

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

        <Pressable
          onPress={() => null}
          style={({ pressed }) => [styles.filters, pressedDefault(pressed), { gap: Device.deviceType !== 1 ? 12 : 8 }]}
          hitSlop={16}
        >
          <Filter
            color={colors.primary}
            size={Device.deviceType !== 1 ? 32 : 24}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
          />

          <Text
            style={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 24 : 18, color: colors.primary }}
            allowFontScaling={false}
          >
            Filters
          </Text>
        </Pressable>
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
  filters: {
    flexDirection: "row",
    alignItems: "center",
  },
});
