import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { theme, getMonday } from "utils/helpers";

export default function Shortcuts() {
  const colors = theme();
  const router = useRouter();
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);

  const setThisWeek = () => {
    const today = new Date();
    const monday = getMonday(today);
    setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });
    router.back();
  };

  const setLastWeek = () => {
    const today = new Date();
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
    <View style={{ gap: Device.deviceType !== 1 ? 24 : 16 }}>
      <Text style={[styles.title, { fontSize: Device.deviceType !== 1 ? 48 : 36, color: colors.primary }]}>
        Shortcuts
      </Text>

      <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={styles.col}>
          <Button text="This week" func={setThisWeek}></Button>
        </View>

        <View style={styles.col}>
          <Button text="Last week" func={setLastWeek}></Button>
        </View>
      </View>

      <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={styles.col}>
          <Button text="This month" func={setThisMonth}></Button>
        </View>

        <View style={styles.col}>
          <Button text="Last month" func={setLastMonth}></Button>
        </View>
      </View>

      <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={styles.col}>
          <Button text="This year" func={setThisYear}></Button>
        </View>

        <View style={styles.col}>
          <Button text="Last year" func={setLastYear}></Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Circular-Bold",
  },
  row: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    alignItems: "center",
  },
});
