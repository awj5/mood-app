import React from "react";
import { useCallback, useContext, useRef, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Insights from "./content/Insights";
import Categories from "./content/Categories";
import { convertToISO, theme } from "utils/helpers";

export default function Content() {
  const db = useSQLiteContext();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const latestQueryRef = useRef<symbol>();
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const getCheckInData = async () => {
    const start = companyDates.rangeStart ? companyDates.rangeStart : companyDates.weekStart;
    var end = new Date(start);

    if (companyDates.rangeEnd) {
      end = companyDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC`,
        [convertToISO(start), convertToISO(end)]
      );

      return rows;
    } catch (error) {
      console.log(error);
    }
  };

  const getCheckIns = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const checkInData = await getCheckInData();

    if (latestQueryRef.current === currentQuery) {
      setCheckIns(checkInData);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCheckIns();
    }, [companyDates])
  );

  return (
    <ScrollView contentContainerStyle={{ flex: checkIns?.length ? 0 : 1 }}>
      <View
        style={[
          styles.wrapper,
          {
            paddingBottom: insets.bottom + spacing,
            gap: spacing,
          },
        ]}
      >
        {checkIns?.length ? (
          <>
            <Insights checkIns={checkIns} dates={companyDates} />
            <Categories />
          </>
        ) : (
          checkIns !== undefined && (
            <Animated.View entering={FadeIn}>
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
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
