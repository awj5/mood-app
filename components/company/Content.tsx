import React, { useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import * as Network from "expo-network";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import { CompanyCheckInType } from "app/company";
import Insights from "./content/Insights";
import Categories from "./content/Categories";
import { getStoredVal, theme, pressedDefault, removeAccess } from "utils/helpers";
import { convertToISO } from "utils/dates";

export default function Content() {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const latestQueryRef = useRef<symbol>();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [checkIns, setCheckIns] = useState<CompanyCheckInType[]>();
  const [isOffline, setIsOffline] = useState(false);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const smallSpacing = Device.deviceType !== 1 ? 6 : 4;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

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
        // User doesn't exist
        removeAccess();
        alert("Access denied.");
      }

      console.log(error);
    }
  };

  const getCheckIns = async () => {
    setCheckIns(undefined); // Show loader
    setIsOffline(false);
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const network = await Network.getNetworkStateAsync();

    if (uuid && network.isInternetReachable) {
      const checkInData = await getCheckInData(uuid); // Get check-ins from Supabase

      if (latestQueryRef.current === currentQuery) {
        setCheckIns(checkInData);
      }
    } else if (!network.isInternetReachable) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    setCheckIns(undefined); // Show loader

    const timeout = setTimeout(() => {
      getCheckIns();
    }, 500); // Delay to avoid flash of loader

    return () => clearTimeout(timeout);
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
            <Insights checkIns={checkIns} dates={companyDates} />
            {/*<Categories />*/}
          </>
        ) : isOffline ? (
          <View style={{ gap: smallSpacing, alignItems: "center" }}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.primary,
                  fontSize: fontSize,
                },
              ]}
            >
              You must be online to view company insights.
            </Text>

            <Pressable onPress={getCheckIns} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
              <Text
                style={[
                  styles.button,
                  {
                    color: colors.primary,
                    fontSize: fontSize,
                    padding: smallSpacing,
                  },
                ]}
                allowFontScaling={false}
              >
                Try again
              </Text>
            </Pressable>
          </View>
        ) : checkIns !== undefined ? (
          <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.primary,
                  fontSize: fontSize,
                },
              ]}
              allowFontScaling={false}
            >
              No check-ins found
            </Text>
          </Animated.View>
        ) : (
          <ActivityIndicator color={colors.primary} size="large" />
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
  text: {
    opacity: 0.5,
    fontFamily: "Circular-Book",
  },
  button: {
    fontFamily: "Circular-Book",
    textDecorationLine: "underline",
  },
});
