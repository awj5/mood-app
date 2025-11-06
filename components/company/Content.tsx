import React, { useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { ScrollView, View, Text, Pressable, ActivityIndicator, useColorScheme } from "react-native";
import * as Device from "expo-device";
import * as Network from "expo-network";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import { CompanyDatesContext, CompanyDatesContextType } from "context/company-dates";
import { CompanyFiltersContext, CompanyFiltersContextType } from "context/company-filters";
import CompanyInsights from "components/CompanyInsights";
import Categories from "./content/Categories";
import Stats from "./content/Stats";
import Role from "components/Role";
import Note from "./content/Note";
import WordCloud from "components/WordCloud";
import { CompanyCheckInType } from "types";
import { getStoredVal, pressedDefault, removeAccess, setStoredVal, getTheme } from "utils/helpers";
import { convertToISO } from "utils/dates";

export type StatsDataType = {
  checkIns: number;
  active: number;
  users: number;
  activated: number;
  demo: boolean;
};

type ContentProps = {
  checkIns: CompanyCheckInType[] | undefined;
  setCheckIns: React.Dispatch<React.SetStateAction<CompanyCheckInType[] | undefined>>;
  company: string;
};

export default function Content(props: ContentProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const latestQueryRef = useRef<symbol>(null);
  const { companyDates } = useContext<CompanyDatesContextType>(CompanyDatesContext);
  const { companyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const [isOffline, setIsOffline] = useState(false);
  const [role, setRole] = useState("");
  const [statsData, setStatsData] = useState<StatsDataType>();
  const [availableCategories, setAvailableCategories] = useState([]);
  const [focusedCategory, setFocusedCategory] = useState(0);
  const isSimulator = Device.isDevice === false;

  const getCheckInData = async (uuid: string) => {
    const start = companyDates.rangeStart ?? companyDates.weekStart;
    let end = new Date(start);

    if (companyDates.rangeEnd) {
      end = companyDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const response = await axios.post(
        !isSimulator ? "https://os.moodcheck.co/api/check-ins" : "http://localhost:3000/api/check-ins",
        {
          uuid: uuid,
          start: convertToISO(start),
          end: convertToISO(end),
          ...(companyFilters.locations.length !== undefined && { locations: companyFilters.locations }),
          ...(companyFilters.teams.length !== undefined && { teams: companyFilters.teams }),
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // User doesn't exist
        removeAccess();
        alert("Access denied.");
      }

      console.error(error);
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
      const data = await getCheckInData(uuid); // Get check-ins from Supabase

      if (latestQueryRef.current === currentQuery) {
        if (data && data.categories) setAvailableCategories(data.categories); // Categories
        if (data && data.focused) setFocusedCategory(data.focused); // Focused category

        // Assign user's role
        if (data && data.role) {
          setRole(data.role);
          setStoredVal("admin", data.role === "admin" ? "true" : "false"); // Remember admin role
        }

        if (data && data.stats) setStatsData(data.stats); // Stats
        props.setCheckIns(data && data.checkInsData ? data.checkInsData : []);
      }
    } else if (!network.isInternetReachable) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    getCheckIns();
  }, [companyDates, companyFilters]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.base,
        paddingBottom: insets.bottom + theme.spacing.base,
        gap: theme.spacing.base,
        width: "100%",
        maxWidth: 768,
        margin: "auto",
      }}
    >
      {props.checkIns?.length ? (
        <>
          <CompanyInsights checkIns={props.checkIns} dates={companyDates} />
          {role !== "user" && <Role text={role} />}
          <Stats checkIns={props.checkIns} role={role} statsData={statsData} />
          <Note />
          {role !== "user" && <WordCloud checkIns={props.checkIns} company={props.company.toUpperCase()} />}
          <Categories
            checkIns={props.checkIns}
            availableCategories={availableCategories}
            role={role}
            focusedCategory={focusedCategory}
            statsData={statsData}
          />
        </>
      ) : isOffline ? (
        <View style={{ gap: theme.spacing.base / 4, alignItems: "center" }}>
          <Text
            style={{
              color: theme.color.opaque,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
              textAlign: "center",
            }}
          >
            You must be online to view insights.
          </Text>

          <Pressable onPress={getCheckIns} style={({ pressed }) => pressedDefault(pressed)} hitSlop={8}>
            <Text
              style={{
                color: theme.color.primary,
                fontSize: theme.fontSize.body,
                fontFamily: "Circular-Book",
                textDecorationLine: "underline",
              }}
              allowFontScaling={false}
            >
              Try again
            </Text>
          </Pressable>
        </View>
      ) : props.checkIns !== undefined ? (
        <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
          <Text
            style={{
              color: theme.color.opaque,
              fontFamily: "Circular-Book",
              fontSize: theme.fontSize.body,
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            Not enough data yet
          </Text>
        </Animated.View>
      ) : (
        <ActivityIndicator color={theme.color.primary} size="large" />
      )}
    </ScrollView>
  );
}
