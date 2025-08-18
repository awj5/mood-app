import { View, Text, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Button from "components/Button";
import { CalendarDatesType } from "types";
import { getTheme } from "utils/helpers";
import { getMonday } from "utils/dates";

type ShortcutsProps = {
  setDates: (dates: CalendarDatesType) => void;
  type: string;
};

export default function Shortcuts(props: ShortcutsProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const month = today.getMonth();

  const setThisWeek = () => {
    props.setDates({ weekStart: getMonday(), rangeStart: undefined, rangeEnd: undefined });
    router.back(); // Close
  };

  const setLastWeek = () => {
    const monday = getMonday();
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    props.setDates({ weekStart: prevMonday, rangeStart: undefined, rangeEnd: undefined });
    router.back(); // Close
  };

  const setThisMonth = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const monday = getMonday(firstDayOfMonth);
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth);
    lastDayOfMonth.setDate(firstDayOfNextMonth.getDate() - 1);
    props.setDates({ weekStart: monday, rangeStart: firstDayOfMonth, rangeEnd: lastDayOfMonth, title: "THIS MONTH'S" });
    router.back(); // Close
  };

  const setPrevDays = (days: number) => {
    const daysAgo = new Date(today);
    daysAgo.setDate(today.getDate() - days);

    props.setDates({
      weekStart: getMonday(daysAgo),
      rangeStart: daysAgo,
      rangeEnd: today,
      title: `PAST ${days} DAYS'`,
    });

    router.back(); // Close
  };

  const setLastMonth = () => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const firstDayOfPrevMonth = new Date(prevMonthYear, prevMonth, 1);
    const firstMondayOfPrevMonth = getMonday(firstDayOfPrevMonth);
    const firstDayOfNextMonth = new Date(prevMonthYear, prevMonth + 1, 1);
    const lastDayOfPrevMonth = new Date(firstDayOfNextMonth);
    lastDayOfPrevMonth.setDate(firstDayOfNextMonth.getDate() - 1);

    props.setDates({
      weekStart: firstMondayOfPrevMonth,
      rangeStart: firstDayOfPrevMonth,
      rangeEnd: lastDayOfPrevMonth,
      title: "LAST MONTH'S",
    });

    router.back(); // Close
  };

  const setThisYear = () => {
    const firstDayOfYear = new Date(year, 0, 1);
    const monday = getMonday(firstDayOfYear);
    const lastDayOfYear = new Date(year, 11, 31);
    props.setDates({ weekStart: monday, rangeStart: firstDayOfYear, rangeEnd: lastDayOfYear, title: "THIS YEAR'S" });
    router.back(); // Close
  };

  const setLastYear = () => {
    const lastYear = year - 1;
    const firstDayOfLastYear = new Date(lastYear, 0, 1);
    const firstMondayOfLastYear = getMonday(firstDayOfLastYear);
    const lastDayOfLastYear = new Date(lastYear, 11, 31);

    props.setDates({
      weekStart: firstMondayOfLastYear,
      rangeStart: firstDayOfLastYear,
      rangeEnd: lastDayOfLastYear,
      title: "LAST YEAR'S",
    });

    router.back(); // Close
  };

  const setPrevWeeks = (weeks: number) => {
    const monday = getMonday();
    const rangeStart = new Date(monday);
    rangeStart.setDate(monday.getDate() - weeks * 7); // First Monday
    const rangeEnd = new Date(monday);
    rangeEnd.setDate(monday.getDate() - 1); // Last Sunday

    props.setDates({
      weekStart: rangeStart,
      rangeStart,
      rangeEnd,
      title: `PAST ${weeks} WEEKS'`,
    });

    router.back(); // Close
  };

  return (
    <View style={{ gap: theme.spacing.small, flexDirection: "row", flexWrap: "wrap" }}>
      <Text
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.small,
          fontFamily: "Circular-Bold",
          width: "100%",
        }}
        allowFontScaling={false}
      >
        SHORTCUTS
      </Text>

      <Button func={setThisWeek}>This week</Button>
      <Button func={setLastWeek}>Last week</Button>

      {props.type === "company" ? (
        <>
          <Button func={() => setPrevWeeks(4)}>Past 4 weeks</Button>
          <Button func={() => setPrevWeeks(8)}>Past 8 weeks</Button>
          <Button func={() => setPrevWeeks(12)}>Past 12 weeks</Button>
        </>
      ) : (
        <>
          <Button func={() => setPrevDays(30)}>Past 30 days</Button>
          <Button func={() => setPrevDays(60)}>Past 60 days</Button>
          <Button func={() => setPrevDays(90)}>Past 90 days</Button>
        </>
      )}

      <Button func={setThisMonth}>This month</Button>
      <Button func={setThisYear}>This year</Button>
      <Button func={setLastMonth}>Last month</Button>
      <Button func={setLastYear}>Last year</Button>
    </View>
  );
}
