import React, { useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CheckInMoodType } from "data/database";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import Loading from "components/Loading";
import Insights from "./content/Insights";
import Categories from "./content/Categories";
import { getStoredVal, removeStoredVal, theme } from "utils/helpers";
import { convertToISO } from "utils/dates";

type CompanyCheckInType = {
  id: number;
  value: CheckInMoodType;
};

export default function Content() {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const latestQueryRef = useRef<symbol>();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const getCheckInData = async (uuid: string) => {
    const start = companyDates.rangeStart ? companyDates.rangeStart : companyDates.weekStart;
    let end = new Date(start);

    if (companyDates.rangeEnd) {
      end = companyDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/check-ins" : "http://localhost:3000/api/check-ins",
        {
          uuid: uuid,
          start: convertToISO(start),
          end: convertToISO(end),
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // User doesn't exist so remove stored UUID and company-name
        removeStoredVal("uuid");
        removeStoredVal("company-name");
        removeStoredVal("send-check-ins");
        alert("Access denied.");
      }

      console.log(error);
    }
  };

  const getCheckIns = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const uuid = await getStoredVal("uuid"); // Check if customer employee

    if (uuid) {
      const checkInData = await getCheckInData(uuid); // Get check-ins from Supabase

      if (latestQueryRef.current === currentQuery) {
        setCheckIns(checkInData);
      }
    }
  };

  useEffect(() => {
    setCheckIns(undefined); // Show loader
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
            <Text
              style={{
                color: colors.primary,
                opacity: 0.5,
                fontFamily: "Circular-Book",
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              }}
              allowFontScaling={false}
            >
              {checkIns.length}
            </Text>
            {/*<Insights checkIns={checkIns} dates={companyDates} />
            <Categories />*/}
          </>
        ) : checkIns !== undefined ? (
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
        ) : (
          <Loading text="Fetching check-ins" />
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
