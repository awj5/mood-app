import React, { useCallback, useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { useFocusEffect } from "expo-router";
import Constants from "expo-constants";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import { CompanyFiltersType } from "context/company-filters";
import { CompanyCheckInType } from "app/company";
import Insights from "components/Insights";
import Categories from "./content/Categories";
import Stats from "./content/Stats";
import Role from "components/Role";
import { getStoredVal, theme, pressedDefault, removeAccess, setStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

export type StatsDataType = {
  checkIns: number;
  users: number;
  participation: number;
};

type ContentProps = {
  checkIns: CompanyCheckInType[] | undefined;
  setCheckIns: React.Dispatch<React.SetStateAction<CompanyCheckInType[] | undefined>>;
  filters: CompanyFiltersType;
};

export default function Content(props: ContentProps) {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const latestQueryRef = useRef<symbol>();
  const filtersRef = useRef<CompanyFiltersType | undefined>();
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const [isOffline, setIsOffline] = useState(false);
  const [role, setRole] = useState("");
  const [statsData, setStatsData] = useState<StatsDataType>();
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
        Constants.appOwnership !== "expo"
          ? "https://mood-web-zeta.vercel.app/api/check-ins"
          : "http://localhost:3000/api/check-ins",
        {
          uuid: uuid,
          start: convertToISO(start),
          end: convertToISO(end),
          role: true, // Will remove
          ...(props.filters.locations.length !== undefined && { locations: props.filters.locations }),
          ...(props.filters.teams.length !== undefined && { teams: props.filters.teams }),
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
    props.setCheckIns(undefined); // Show loader
    setIsOffline(false);
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const network = await Network.getNetworkStateAsync();

    if (uuid && network.isInternetReachable) {
      const checkInData = await getCheckInData(uuid); // Get check-ins from Supabase

      if (latestQueryRef.current === currentQuery) {
        props.setCheckIns(checkInData && checkInData.checkInsData ? checkInData.checkInsData : []);
        filtersRef.current = props.filters;

        // Assign user's role
        if (checkInData && checkInData.role) {
          setRole(checkInData.role);
          setStoredVal("admin", checkInData.role === "admin" ? "true" : "false"); // Remember admin
        }

        // Stats
        if (checkInData && checkInData.stats) {
          setStatsData(checkInData.stats);
        }
      }
    } else if (!network.isInternetReachable) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    props.setCheckIns(undefined); // Show loader

    const timeout = setTimeout(() => {
      getCheckIns();
    }, 500); // Delay to avoid flash of loader

    return () => clearTimeout(timeout);
  }, [companyDates]);

  useFocusEffect(
    useCallback(() => {
      if (filtersRef.current && props.filters !== filtersRef.current) {
        getCheckIns(); // Filters have changed
      }
    }, [props.filters])
  );

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: props.checkIns?.length ? 0 : 1, alignItems: "center" }}
    >
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
        {props.checkIns?.length ? (
          <>
            <Insights checkIns={props.checkIns} dates={companyDates} />
            {role !== "user" && <Role text={role} />}
            <Stats checkIns={props.checkIns} statsData={statsData} role={role} />
            <Categories checkIns={props.checkIns} role={role} />
          </>
        ) : isOffline ? (
          <View style={{ gap: smallSpacing, alignItems: "center" }}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.opaque,
                  fontSize: fontSize,
                },
              ]}
            >
              {"You must be online to view\ncompany insights."}
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
        ) : props.checkIns !== undefined ? (
          <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.opaque,
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
  role: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  button: {
    fontFamily: "Circular-Book",
    textDecorationLine: "underline",
  },
});
