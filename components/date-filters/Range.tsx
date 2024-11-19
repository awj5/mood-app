import { useContext, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { getMonday, theme } from "utils/helpers";

export default function Range() {
  const colors = theme();
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [showStartPicker, setShowStartPicker] = useState(Platform.OS === "ios");
  const [showEndPicker, setShowEndPicker] = useState(Platform.OS === "ios");
  const labelFontSize = Device.deviceType !== 1 ? 20 : 16;
  const colGap = Device.deviceType !== 1 ? 16 : Platform.OS === "ios" ? 4 : 12;
  const labelWidth = Device.deviceType !== 1 ? 120 : Platform.OS === "ios" ? 40 : "auto";
  const colDirection = Platform.OS === "ios" ? "row" : "column";
  const colAlign = Platform.OS === "ios" ? "center" : "stretch";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(homeDates.weekStart);
  weekEnd.setDate(homeDates.weekStart.getDate() + 6); // Sunday
  const endOfYear = new Date(new Date().getFullYear(), 11, 31);

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios"); // Hide picker on Android

    if (event.type === "set") {
      const date = selectedDate as Date;
      const monday = getMonday(date);
      const weekLater = new Date(date);
      weekLater.setDate(date.getDate() + 7);

      setHomeDates({
        ...homeDates,
        weekStart: monday,
        rangeStart: date,
        rangeEnd: homeDates?.rangeEnd ?? weekLater,
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

      setHomeDates({
        ...homeDates,
        weekStart: homeDates.rangeStart ? homeDates.weekStart : monday,
        rangeStart: homeDates.rangeStart ?? prevWeek,
        rangeEnd: date,
      });
    }
  };

  return (
    <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 24 : 16 }}>
      <View style={[styles.col, { gap: colGap, flexDirection: colDirection, alignItems: colAlign }]}>
        <Text
          style={[styles.label, { color: colors.primary, fontSize: labelFontSize, width: labelWidth }]}
          allowFontScaling={false}
        >
          Start{Device.deviceType !== 1 && " date:"}
        </Text>

        {Platform.OS !== "ios" && (
          <Button func={() => setShowStartPicker(true)} fill icon="calendar">
            {homeDates.rangeStart
              ? homeDates.rangeStart.toLocaleDateString()
              : homeDates.weekStart.toLocaleDateString()}
          </Button>
        )}

        {showStartPicker && (
          <DateTimePicker
            value={homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart}
            mode="date"
            onChange={onStartChange}
            accentColor={colors.primary}
            style={{ flex: 1 }}
            minimumDate={new Date(2024, 0, 1)}
            maximumDate={endOfYear}
          />
        )}
      </View>

      <View style={[styles.col, { gap: colGap, flexDirection: colDirection, alignItems: colAlign }]}>
        <Text
          style={[styles.label, { color: colors.primary, fontSize: labelFontSize, width: labelWidth }]}
          allowFontScaling={false}
        >
          End{Device.deviceType !== 1 && " date:"}
        </Text>

        {Platform.OS !== "ios" && (
          <Button func={() => setShowEndPicker(true)} fill icon="calendar">
            {homeDates.rangeEnd ? homeDates.rangeEnd.toLocaleDateString() : weekEnd.toLocaleDateString()}
          </Button>
        )}

        {showEndPicker && (
          <DateTimePicker
            value={homeDates.rangeEnd ? homeDates.rangeEnd : weekEnd}
            mode="date"
            onChange={onEndChange}
            accentColor={colors.primary}
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
    fontFamily: "Circular-Book",
  },
});
