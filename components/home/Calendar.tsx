import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import Animated, { Easing, FadeIn } from "react-native-reanimated";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Week from "./calendar/Week";
import { getMonday } from "utils/dates";

type CalendarProps = {
  height: number;
  appState: "active" | "background" | "inactive" | "unknown" | "extension";
};

export default function Calendar(props: CalendarProps) {
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const pagerViewRef = useRef<PagerView>(null);
  const todayRef = useRef<Date | null>(null);
  const [weeks, setWeeks] = useState<Date[]>([]);
  const [initPage, setInitPage] = useState(0);
  const defaultPageCount = 11; // Display 12 weeks

  const pageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const monday = weeks[e.nativeEvent.position];

    if (!homeDates.rangeStart && homeDates.weekStart.getTime() !== monday.getTime())
      setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });
  };

  const setDefaultPages = () => {
    // Weeks to display when no start and end date range is set
    const monday = getMonday();
    const mondays: Date[] = [];

    // Get 11 previous Mondays
    for (let i = defaultPageCount; i >= 1; i--) {
      const prevMonday = new Date(monday);
      prevMonday.setDate(monday.getDate() - i * 7);
      mondays.push(prevMonday);
    }

    mondays.push(monday); // Include current Monday last

    // Hack! - Force PagerView to re-mount so initialPage is updated
    requestAnimationFrame(() => {
      setWeeks(mondays);
    });
  };

  const isLastWeek = (date: Date) => {
    const monday = getMonday();
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    return prevMonday.getTime() === date.getTime();
  };

  useEffect(() => {
    setWeeks([]);

    if (homeDates.rangeStart && homeDates.rangeEnd) {
      // Date range has been set
      setInitPage(0);
      const startMonday = new Date(homeDates.weekStart);
      const endMonday = getMonday(homeDates.rangeEnd);
      const mondays: Date[] = [];

      // Get mondays within date range
      for (
        let currentMonday = new Date(startMonday);
        currentMonday <= endMonday;
        currentMonday.setDate(currentMonday.getDate() + 7)
      ) {
        mondays.push(new Date(currentMonday));
      }

      // Hack! - Force PagerView to re-mount so initialPage is updated
      requestAnimationFrame(() => {
        setWeeks(mondays);
      });
    } else {
      // Date range no longer applied
      setInitPage(isLastWeek(homeDates.weekStart) ? defaultPageCount - 1 : defaultPageCount); // Last or current week
      setDefaultPages();
    }
  }, [homeDates.rangeStart, homeDates.rangeEnd]);

  useEffect(() => {
    // Automatically move to current or last week
    const monday = getMonday();

    if (isLastWeek(homeDates.weekStart)) {
      pagerViewRef.current?.setPageWithoutAnimation(defaultPageCount - 1); // Last week
    } else if (monday.getTime() === homeDates.weekStart.getTime()) {
      pagerViewRef.current?.setPageWithoutAnimation(defaultPageCount); // Current week
    }
  }, [homeDates]);

  useFocusEffect(
    useCallback(() => {
      // Set calendar to current week on init and when app returns to focus
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Only set on focus if day has changed
      if (
        (props.appState === "active" && !todayRef.current) ||
        (props.appState === "active" && todayRef.current && todayRef.current.getTime() !== today.getTime())
      ) {
        setWeeks([]);
        setInitPage(defaultPageCount); // Last week
        setHomeDates({ weekStart: getMonday(today), rangeStart: undefined, rangeEnd: undefined }); // Reset
        setDefaultPages();
      }

      todayRef.current = today;
    }, [props.appState])
  );

  return (
    <View
      style={{
        height: props.height,
      }}
    >
      {weeks.length ? (
        <Animated.View entering={FadeIn.duration(300).easing(Easing.in(Easing.cubic))}>
          <PagerView
            ref={pagerViewRef}
            initialPage={initPage}
            style={{ height: "100%" }}
            onPageSelected={(e) => pageSelected(e)}
          >
            {weeks.map((item) => (
              <Week key={item.getTime()} monday={item} />
            ))}
          </PagerView>
        </Animated.View>
      ) : null}
    </View>
  );
}
