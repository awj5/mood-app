import { useContext, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Bg from "components/home/Bg";
import HeaderTitle from "components/HeaderTitle";
import HeaderDates from "components/HeaderDates";
import { theme, getMonday } from "utils/helpers";

export default function CompanyDash() {
  const colors = theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { companyDates, setCompanyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const padding = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    // Always set to past 30 days on mount
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAgo = new Date();
    daysAgo.setHours(0, 0, 0, 0);
    daysAgo.setDate(today.getDate() - 30);

    setCompanyDates({
      weekStart: getMonday(daysAgo),
      rangeStart: daysAgo,
      rangeEnd: today,
      title: "PAST 30 DAY'S",
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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 24 : 18 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => <HeaderDates dates={companyDates} type="company" />,
        }}
      />

      <Bg />
      <HeaderTitle text="Acme, Inc." transparentHeader />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: padding,
          paddingTop: padding / 2,
          paddingBottom: insets.bottom + padding,
        }}
      ></ScrollView>
    </View>
  );
}
