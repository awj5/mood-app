import { useContext, useState } from "react";
import { Pressable, StyleSheet, SafeAreaView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { theme, pressedDefault, getMonday } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  //const [date, setDate] = useState(new Date(1598051730000));

  /*const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };*/

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
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Date Filters",
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text style={[styles.headerText, { fontSize: Device.deviceType !== 1 ? 20 : 16, color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={[{ padding: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="This week" func={setThisWeek}></Button>
          <Button text="Last week" func={setLastWeek}></Button>
        </View>

        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="This month" func={setThisMonth}></Button>
          <Button text="Last month" func={setLastMonth}></Button>
        </View>

        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="This year" func={setThisYear}></Button>
          <Button text="Last year" func={setLastYear}></Button>
        </View>

        {/*<DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={onChange} />*/}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontFamily: "Circular-Book",
  },
  row: {
    flexDirection: "row",
  },
});
