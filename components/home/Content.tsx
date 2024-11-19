import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import { CalendarDatesType } from "context/home-dates";
import Insights from "./Insights";
import Loading from "./Loading";
import { getMonday, isInRange } from "utils/helpers";

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

  const getContent = async (dates: CalendarDatesType, focused?: boolean) => {
    const currentQuery = Symbol("currentQuery");
    if (!focused) latestQueryRef.current = currentQuery;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkInCount = await getCheckInCount();

    // Only get updated content if date filters have changed or a new checkin has occurred
    if (
      (latestQueryRef.current === currentQuery && !focused) ||
      (focused &&
        !dates.rangeStart &&
        dates.weekStart.getTime() === getMonday(today).getTime() &&
        checkInCount !== checkInCounter.current) ||
      (focused && dates.rangeStart && isInRange(today) && checkInCount !== checkInCounter.current)
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setLoadingContent(true);

      timeoutRef.current = setTimeout(() => {
        setLoadingContent(false);
        timeoutRef.current = null;
      }, 2000);

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
    <ScrollView contentContainerStyle={{ flex: loadingContent ? 1 : 0 }}>
      <View
        style={{
          alignItems: "center",
          flex: loadingContent ? 1 : 0,
          justifyContent: loadingContent ? "center" : "flex-start",
          paddingTop: edgePadding,
          paddingBottom: edgePadding * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
        }}
      >
        {!loadingContent ? <Insights /> : <Loading />}
      </View>
    </ScrollView>
  );
}
