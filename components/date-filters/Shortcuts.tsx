import { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { getMonday, theme } from "utils/helpers";

export default function Shortcuts() {
  const router = useRouter();
  const colors = theme();
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);

  const setThisWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = getMonday(today);
    setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });
    router.back();
  };

  const setLastWeek = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = getMonday(today);
    const prevMonday = new Date(monday);
    prevMonday.setDate(monday.getDate() - 7);
    setHomeDates({ weekStart: prevMonday, rangeStart: undefined, rangeEnd: undefined });
    router.back();
  };

  const setThisMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const monday = getMonday(firstDayOfMonth);
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth);
    lastDayOfMonth.setDate(firstDayOfNextMonth.getDate() - 1);
    setHomeDates({ weekStart: monday, rangeStart: firstDayOfMonth, rangeEnd: lastDayOfMonth });
    router.back();
  };

  const setPrevDays = (days: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAgo = new Date();
    daysAgo.setHours(0, 0, 0, 0);
    daysAgo.setDate(today.getDate() - days);
    setHomeDates({ weekStart: getMonday(daysAgo), rangeStart: daysAgo, rangeEnd: today });
    router.back();
  };

  const setLastMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const firstDayOfPrevMonth = new Date(prevMonthYear, prevMonth, 1);
    const firstMondayOfPrevMonth = getMonday(firstDayOfPrevMonth);
    const firstDayOfNextMonth = new Date(prevMonthYear, prevMonth + 1, 1);
    const lastDayOfPrevMonth = new Date(firstDayOfNextMonth);
    lastDayOfPrevMonth.setDate(firstDayOfNextMonth.getDate() - 1);
    setHomeDates({ weekStart: firstMondayOfPrevMonth, rangeStart: firstDayOfPrevMonth, rangeEnd: lastDayOfPrevMonth });
    router.back();
  };

  const setThisYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const monday = getMonday(firstDayOfYear);
    const lastDayOfYear = new Date(year, 11, 31);
    setHomeDates({ weekStart: monday, rangeStart: firstDayOfYear, rangeEnd: lastDayOfYear });
    router.back();
  };

  const setLastYear = () => {
    const today = new Date();
    const year = today.getFullYear() - 1;
    const firstDayOfLastYear = new Date(year, 0, 1);
    const firstMondayOfLastYear = getMonday(firstDayOfLastYear);
    const lastDayOfLastYear = new Date(year, 11, 31);
    setHomeDates({ weekStart: firstMondayOfLastYear, rangeStart: firstDayOfLastYear, rangeEnd: lastDayOfLastYear });
    router.back();
  };

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 16 : 12 }]}>
      <Text
        style={[styles.label, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
        allowFontScaling={false}
      >
        SHORTCUTS
      </Text>

      <Button func={setThisWeek}>This week</Button>
      <Button func={setLastWeek}>Last week</Button>
      <Button func={setThisMonth}>This month</Button>
      <Button func={setLastMonth}>Last month</Button>
      <Button func={() => setPrevDays(30)}>Past 30 days</Button>
      <Button func={() => setPrevDays(60)}>Past 60 days</Button>
      <Button func={setThisYear}>This year</Button>
      <Button func={setLastYear}>Last year</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  label: {
    fontFamily: "Circular-Bold",
    width: "100%",
  },
});
