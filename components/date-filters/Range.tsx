import { useState } from "react";
import { Platform, Text, useColorScheme, View, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import Button from "components/Button";
import { CalendarDatesType } from "types";
import { getTheme } from "utils/helpers";
import { getMonday } from "utils/dates";

type RangeProps = {
  dates: CalendarDatesType;
  setDates: (dates: CalendarDatesType) => void;
};

export default function Range(props: RangeProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [showStartPicker, setShowStartPicker] = useState(Platform.OS === "ios");
  const [showEndPicker, setShowEndPicker] = useState(Platform.OS === "ios");
  const weekEnd = new Date(props.dates.weekStart);
  weekEnd.setDate(props.dates.weekStart.getDate() + 6); // Sunday
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);

  const onStartChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios"); // Hide picker on Android

    if (e.type === "set") {
      const date = selectedDate as Date;
      const monday = getMonday(date);
      const weekLater = new Date(date);
      weekLater.setDate(date.getDate() + 7);

      props.setDates({
        weekStart: monday,
        rangeStart: date,
        rangeEnd: props.dates?.rangeEnd ?? weekLater,
      });
    }
  };

  const onEndChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios"); // Hide picker on Android

    if (e.type === "set") {
      const date = selectedDate as Date;
      const prevWeek = new Date(date);
      prevWeek.setDate(date.getDate() - 7);
      const monday = getMonday(prevWeek);

      props.setDates({
        weekStart: props.dates.rangeStart ? props.dates.weekStart : monday,
        rangeStart: props.dates.rangeStart ?? prevWeek,
        rangeEnd: date,
      });
    }
  };

  return (
    <View style={{ gap: theme.spacing.base }}>
      <View style={styles.date}>
        <Text
          style={{
            color: theme.color.primary,
            fontFamily: "Circular-Medium",
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          Start Date
        </Text>

        {Platform.OS === "android" && (
          <Button func={() => setShowStartPicker(true)} fill icon={CalendarDays}>
            {props.dates.rangeStart
              ? props.dates.rangeStart.toLocaleDateString()
              : props.dates.weekStart.toLocaleDateString()}
          </Button>
        )}

        {showStartPicker && (
          <DateTimePicker
            value={props.dates.rangeStart ? props.dates.rangeStart : props.dates.weekStart}
            mode="date"
            onChange={onStartChange}
            accentColor={theme.color.link}
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={endOfYear}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: theme.color.primary,
            fontFamily: "Circular-Medium",
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          End Date
        </Text>

        {Platform.OS === "android" && (
          <Button func={() => setShowEndPicker(true)} fill icon={CalendarDays}>
            {props.dates.rangeEnd ? props.dates.rangeEnd.toLocaleDateString() : weekEnd.toLocaleDateString()}
          </Button>
        )}

        {showEndPicker && (
          <DateTimePicker
            value={props.dates.rangeEnd ? props.dates.rangeEnd : weekEnd}
            mode="date"
            onChange={onEndChange}
            accentColor={theme.color.link}
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={endOfYear}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
