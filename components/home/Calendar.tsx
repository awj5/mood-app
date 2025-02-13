import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, AppState, ActivityIndicator } from "react-native";
import * as Device from "expo-device";
import { useFocusEffect } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Week from "./calendar/Week";
import { theme } from "utils/helpers";
import { getMonday } from "utils/dates";

export default function Calendar() {
  const colors = theme();
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const pagerViewRef = useRef<PagerView>(null);
  const appStateRef = useRef(AppState.currentState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const todayRef = useRef<Date | null>(null);
  const [weeks, setWeeks] = useState<Date[]>([]);
  const [visible, setVisible] = useState(false);
  const [initPage, setInitPage] = useState(0);
  const [page, setPage] = useState(0);
  const [appStateVisible, setAppStateVisible] = useState(appStateRef.current);
  const defaultPageCount = 11; // Display 12 weeks

  const isLastWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = getMonday(today);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    return prevMonday.getTime() === date.getTime();
  };

  const pageSelected = (e: PagerViewOnPageSelectedEvent) => {
    if (!homeDates.rangeStart) {
      setPage(e.nativeEvent.position);

      if (homeDates.weekStart.getTime() !== weeks[e.nativeEvent.position].getTime())
        setHomeDates({ weekStart: weeks[e.nativeEvent.position], rangeStart: undefined, rangeEnd: undefined });
    }
  };

  const setDefaultPages = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = getMonday(today);
    const mondays = [];

    // Get 11 previous Mondays
    for (let i = defaultPageCount; i >= 1; i--) {
      let prevMonday = new Date(monday);
      prevMonday.setDate(monday.getDate() - i * 7);
      mondays.push(prevMonday);
    }

    mondays.push(monday); // Add current
    setWeeks(mondays);

    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      timeoutRef.current = null;
    }, 500);
  };

  useFocusEffect(
    useCallback(() => {
      // Set calendar to current week on init and when app returns to focus
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Only set on focus if day has changed
      if (
        (appStateVisible === "active" && !todayRef.current) ||
        (appStateVisible === "active" && todayRef.current && todayRef.current.getTime() !== today.getTime())
      ) {
        setVisible(false);
        setInitPage(defaultPageCount);
        const monday = getMonday(today);
        setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined }); // Reset
        setDefaultPages();
      }

      todayRef.current = today;
    }, [appStateVisible])
  );

  useEffect(() => {
    if (homeDates.rangeStart && homeDates.rangeEnd) {
      // Date range has been set
      setVisible(false);
      setInitPage(0);
      const startMonday = new Date(homeDates.weekStart);
      const endMonday = getMonday(homeDates.rangeEnd);
      const mondays = [];

      // Get mondays within date range
      for (
        let currentMonday = new Date(startMonday);
        currentMonday <= endMonday;
        currentMonday.setDate(currentMonday.getDate() + 7)
      ) {
        mondays.push(new Date(currentMonday));
      }

      setWeeks(mondays);

      const timeout = setTimeout(() => {
        setVisible(true);
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      // Date range no longer applied
      setVisible(false);
      setInitPage(isLastWeek(homeDates.weekStart) ? defaultPageCount - 1 : defaultPageCount); // Current or last week
      setDefaultPages();
    }
  }, [homeDates.rangeStart, homeDates.rangeEnd]);

  useEffect(() => {
    // Automatically move to current or last week
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = getMonday(today);

    if (page !== defaultPageCount - 1 && isLastWeek(homeDates.weekStart)) {
      pagerViewRef.current?.setPageWithoutAnimation(defaultPageCount - 1); // Last week
    } else if (page !== defaultPageCount && monday.getTime() === homeDates.weekStart.getTime()) {
      pagerViewRef.current?.setPageWithoutAnimation(defaultPageCount); // Current week
    }
  }, [homeDates]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appStateRef.current = nextAppState;
      setAppStateVisible(appStateRef.current);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View
      style={{
        justifyContent: "center",
        height: Device.deviceType !== 1 ? 128 : 96,
      }}
    >
      {visible ? (
        <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
          <PagerView
            ref={pagerViewRef}
            initialPage={initPage}
            style={{ height: "100%" }}
            onPageSelected={(e) => pageSelected(e)}
          >
            {weeks.map((item, index) => (
              <View key={index} style={styles.page}>
                <Week monday={item} />
              </View>
            ))}
          </PagerView>
        </Animated.View>
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
