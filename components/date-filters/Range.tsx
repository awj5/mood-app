import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { CalendarDays } from "lucide-react-native";
import { CalendarDatesType } from "context/home-dates";
import Button from "components/Button";
import { theme } from "utils/helpers";
import { getMonday } from "utils/dates";

type RangeProps = {
  dates: CalendarDatesType;
  setDates: (dates: CalendarDatesType) => void;
};

export default function Range(props: RangeProps) {
  const colors = theme();
  const [showStartPicker, setShowStartPicker] = useState(Platform.OS === "ios");
  const [showEndPicker, setShowEndPicker] = useState(Platform.OS === "ios");
  const labelFontSize = Device.deviceType !== 1 ? 20 : 16;
  const colGap = Device.deviceType !== 1 ? 16 : Platform.OS === "ios" ? 4 : 12;
  const labelWidth = Device.deviceType !== 1 ? 120 : Platform.OS === "ios" ? 40 : "auto";
  const colDirection = Platform.OS === "ios" ? "row" : "column";
  const colAlign = Platform.OS === "ios" ? "center" : "stretch";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(props.dates.weekStart);
  weekEnd.setDate(props.dates.weekStart.getDate() + 6); // Sunday
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios"); // Hide picker on Android

    if (event.type === "set") {
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

  const onEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios"); // Hide picker on Android

    if (event.type === "set") {
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
    <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 24 : 16 }}>
      <View style={[styles.col, { gap: colGap, flexDirection: colDirection, alignItems: colAlign }]}>
        <Text
          style={[
            styles.label,
            {
              color: colors.primary,
              fontSize: labelFontSize,
              width: labelWidth,
              alignSelf: Platform.OS === "ios" ? "auto" : "center",
            },
          ]}
          allowFontScaling={false}
        >
          Start{Device.deviceType !== 1 && " date:"}
        </Text>

        {Platform.OS !== "ios" && (
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
            accentColor={colors.link}
            style={{ flex: 1 }}
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={endOfYear}
          />
        )}
      </View>

      <View style={[styles.col, { gap: colGap, flexDirection: colDirection, alignItems: colAlign }]}>
        <Text
          style={[
            styles.label,
            {
              color: colors.primary,
              fontSize: labelFontSize,
              width: labelWidth,
              alignSelf: Platform.OS === "ios" ? "auto" : "center",
            },
          ]}
          allowFontScaling={false}
        >
          End{Device.deviceType !== 1 && " date:"}
        </Text>

        {Platform.OS !== "ios" && (
          <Button func={() => setShowEndPicker(true)} fill icon={CalendarDays}>
            {props.dates.rangeEnd ? props.dates.rangeEnd.toLocaleDateString() : weekEnd.toLocaleDateString()}
          </Button>
        )}

        {showEndPicker && (
          <DateTimePicker
            value={props.dates.rangeEnd ? props.dates.rangeEnd : weekEnd}
            mode="date"
            onChange={onEndChange}
            accentColor={colors.link}
            style={{ flex: 1 }}
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={endOfYear}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    flex: 1,
  },
  label: {
    fontFamily: "Circular-Medium",
  },
});
