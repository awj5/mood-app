import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckInType } from "data/database";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { CalendarDatesType } from "context/home-dates";
import Insights from "./content/Insights";
import Loading from "./Loading";
import { convertToISO, getMonday, isInRange } from "utils/helpers";

export default function Content() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const isFirstFocus = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkInCounter = useRef(0);
  const latestQueryRef = useRef<symbol | null>(null);
  const homeDatesRef = useRef(homeDates);
  const [loadingContent, setLoadingContent] = useState(true);
  const [insights, setInsights] = useState("");
  const edgePadding = Device.deviceType !== 1 ? 24 : 16;

  const getCheckInCount = async () => {
    try {
      const query = `
    SELECT * FROM check_ins
  `;

      const rows = await db.getAllAsync(query);
      return rows.length;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };

  const getData = async () => {
    const start = homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart;
    var end = new Date(start);

    if (homeDates.rangeEnd) {
      end = homeDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const query = `
      SELECT * FROM check_ins
      WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC
    `;

      const rows: CheckInType[] = await db.getAllAsync(query, [convertToISO(start), convertToISO(end)]);
      return rows;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getContent = async (dates: CalendarDatesType, focused?: boolean) => {
    const currentQuery = Symbol("currentQuery");
    if (!focused) latestQueryRef.current = currentQuery;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInCount = await getCheckInCount();
    const checkInData = await getData();

    // Only get updated content if date filters have changed or a new checkin has occurred
    if (
      (latestQueryRef.current === currentQuery && !focused) ||
      (focused &&
        !dates.rangeStart &&
        dates.weekStart.getTime() === getMonday(today).getTime() &&
        checkInCount !== checkInCounter.current) ||
      (focused &&
        dates.rangeStart &&
        isInRange(today, dates.rangeStart, dates.rangeEnd) &&
        checkInCount !== checkInCounter.current)
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setLoadingContent(true);

      timeoutRef.current = setTimeout(() => {
        // Call AI API
        setInsights(
          checkInData?.length
            ? "Prioritized mental well-being by balancing tasks, taking regular breaks, and practicing mindfulness. Felt more focused, less stressed, and maintained a positive outlook all week."
            : ""
        );

        setLoadingContent(false);
        timeoutRef.current = null;
      }, 1000); // Pause to avoid excessive calls on calendar swiping

      checkInCounter.current = checkInCount;
    }
  };

  useEffect(() => {
    homeDatesRef.current = homeDates;
    getContent(homeDates);
  }, [homeDates]);

  useFocusEffect(
    useCallback(() => {
      // Don't fire on mount
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      getContent(homeDatesRef.current, true);
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={{ flex: !loadingContent && insights ? 0 : 1 }}>
      <View
        style={{
          alignItems: "center",
          flex: !loadingContent && insights ? 0 : 1,
          justifyContent: !loadingContent && insights ? "flex-start" : "center",
          paddingTop: edgePadding,
          paddingBottom: edgePadding * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
        }}
      >
        {!loadingContent && insights ? (
          <Insights text={insights} />
        ) : !loadingContent ? (
          <Text>No results</Text>
        ) : (
          <Loading />
        )}
      </View>
    </ScrollView>
  );
}
