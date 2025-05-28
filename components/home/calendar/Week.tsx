import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import Day from "./Day";
import { getTheme } from "utils/helpers";

type WeekProps = {
  monday: Date;
};

export default function Week(props: WeekProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const week: Date[] = [];

    // Get dates from week starting from Monday
    for (let i = 0; i < 7; i++) {
      const date = new Date(props.monday);
      date.setDate(props.monday.getDate() + i);
      week.push(date);
    }

    setDays(week);
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        maxWidth: 768,
        alignSelf: "center",
        paddingHorizontal: theme.spacing.base,
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
      }}
    >
      {days.map((item) => (
        <Day key={item.getTime()} date={item} />
      ))}
    </View>
  );
}
