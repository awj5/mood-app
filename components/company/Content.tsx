import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Insights from "./content/Insights";
import Categories from "./content/Categories";
import { theme } from "utils/helpers";

export default function Content() {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const getCheckIns = async () => {
    //
  };

  useEffect(() => {
    getCheckIns();
  }, [companyDates]);

  return (
    <ScrollView contentContainerStyle={{ flex: checkIns?.length ? 0 : 1, alignItems: "center" }}>
      <View
        style={[
          styles.wrapper,
          {
            paddingBottom: insets.bottom + spacing,
            gap: spacing,
            paddingHorizontal: spacing,
          },
        ]}
      >
        {checkIns?.length ? (
          <>
            {/*<Insights checkIns={checkIns} dates={companyDates} />
            <Categories />*/}
          </>
        ) : (
          checkIns !== undefined && (
            <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
              <Text
                style={{
                  color: colors.primary,
                  opacity: 0.5,
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                }}
                allowFontScaling={false}
              >
                No check-ins found
              </Text>
            </Animated.View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 720 + 48,
  },
});
