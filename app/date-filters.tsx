import { useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Range from "components/date-filters/Range";
import Shortcuts from "components/date-filters/Shortcuts";
import HeaderTitle from "components/HeaderTitle";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const params = useLocalSearchParams<{ type: string }>();
  const colors = theme();
  const router = useRouter();
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
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                  color: colors.primary,
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
            ? "Explore the anonymous mood check-in history of your colleagues by selecting a specific date range or tapping a shortcut."
            : "Explore your mood check-in history by selecting a specific date range or tapping a shortcut."
        }
      />

      <View
        style={[
          {
            paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
            paddingTop: Device.deviceType !== 1 ? 36 : 24,
            gap: Device.deviceType !== 1 ? 48 : 32,
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
