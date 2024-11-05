import { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Week from "./calendar/Week";
import { getMonday } from "utils/helpers";

export default function Calendar() {
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [weeks, setWeeks] = useState<Date[]>([]);
  const pagerViewRef = useRef<PagerView>(null);

  const pageSelected = (e: PagerViewOnPageSelectedEvent) => {
    setHomeDates({ ...homeDates, weekStart: weeks[e.nativeEvent.position] });
  };

  useEffect(() => {
    // Set Monday of current week
    const today = new Date();
    const monday = getMonday(today);
    const mondays = [];

    // Get 11 previous Mondays
    for (let i = 11; i >= 1; i--) {
      let prevMonday = new Date(monday);
      prevMonday.setDate(monday.getDate() - i * 7);
      mondays.push(prevMonday);
    }

    mondays.push(monday); // Add current
    setWeeks(mondays);

    // Hack! - Set the initial page on Android
    setTimeout(() => {
      pagerViewRef.current?.setPageWithoutAnimation(mondays.length - 1);
      setHomeDates({ ...homeDates, weekStart: monday });
    }, 0);
  }, []);

  useEffect(() => {
    // Automatically move to current or last week
    const today = new Date();
    const monday = getMonday(today);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);

    if (prevMonday.toLocaleDateString() === homeDates?.weekStart.toLocaleDateString()) {
      pagerViewRef.current?.setPageWithoutAnimation(weeks.length - 2); // Last week
    } else if (monday.toLocaleDateString() === homeDates?.weekStart.toLocaleDateString()) {
      pagerViewRef.current?.setPageWithoutAnimation(weeks.length - 1); // Current week
    }
  }, [homeDates]);

  return (
    <PagerView
      ref={pagerViewRef}
      style={{ height: Device.deviceType !== 1 ? 128 : 96 }}
      initialPage={weeks.length - 1}
      onPageSelected={(e) => pageSelected(e)}
    >
      {weeks.map((item, index) => (
        <View key={index} style={styles.page}>
          <Week monday={item} />
        </View>
      ))}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
