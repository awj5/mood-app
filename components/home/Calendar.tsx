import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import Week from "./calendar/Week";
import { CalendarDatesType } from "app";

type CalendarProps = {
  calendarDates: CalendarDatesType | undefined;
  setCalendarDates: React.Dispatch<React.SetStateAction<CalendarDatesType | undefined>>;
};

export default function Calendar(props: CalendarProps) {
  const [weeks, setWeeks] = useState<Date[]>([]);
  const paddingX = Device.deviceType !== 1 ? 24 : 16;

  const pageSelected = (e: PagerViewOnPageSelectedEvent) => {
    props.setCalendarDates({
      weekStart: weeks[e.nativeEvent.position],
    });
  };

  useEffect(() => {
    // Set Monday of current week
    const today = new Date(); // Local
    const day = today.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);

    props.setCalendarDates({
      weekStart: monday,
    });

    const mondays = [];

    // Get 11 previous Mondays
    for (let i = 11; i >= 1; i--) {
      let prevMonday = new Date(monday);
      prevMonday.setDate(monday.getDate() - i * 7);
      mondays.push(prevMonday);
    }

    mondays.push(monday); // Add current
    setWeeks(mondays);
  }, []);

  return (
    <PagerView
      style={{ height: Device.deviceType !== 1 ? 128 : 96 }}
      initialPage={weeks.length - 1}
      onPageSelected={(e) => pageSelected(e)}
    >
      {weeks.map((item, index) => (
        <View style={[styles.page, { paddingHorizontal: paddingX }]} key={index}>
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
  },
});
