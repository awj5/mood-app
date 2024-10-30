import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Entry from "./calendar/Entry";

type CalendarProps = {};

export default function Calendar(props: CalendarProps) {
  const [days, setDays] = useState<Date[]>();

  useEffect(() => {
    const today = new Date();
    const day = today.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    const week: Date[] = [];

    // Get dates from current week starting from Monday
    for (let i = 0; i < 7; i++) {
      let date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }

    setDays(week);
  }, []);

  return (
    <View style={styles.container}>
      {days?.map((item, index) => (
        <Entry key={index} date={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 512,
    justifyContent: "space-between",
  },
});
