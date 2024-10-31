import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Day from "./Day";

type WeekProps = {
  monday: Date;
};

export default function Week(props: WeekProps) {
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const week: Date[] = [];

    // Get dates from week starting from Monday
    for (let i = 0; i < 7; i++) {
      let date = new Date(props.monday);
      date.setDate(props.monday.getDate() + i);
      week.push(date);
    }

    setDays(week);
  }, []);

  return (
    <View style={styles.container}>
      {days.map((item, index) => (
        <Day key={index} date={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    maxWidth: 576,
    justifyContent: "space-between",
  },
});
