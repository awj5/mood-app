import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { getMonday, theme } from "utils/helpers";

export default function Range() {
  const colors = theme();
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const labelFontSize = Device.deviceType !== 1 ? 24 : 18;
  const colGap = Device.deviceType !== 1 ? 16 : 4;
  const today = new Date();
  const weekEnd = new Date(!homeDates ? today : homeDates.weekStart);
  weekEnd.setDate((!homeDates ? today : homeDates.weekStart).getDate() + 6); // Sunday

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set") {
      const date = selectedDate as Date;
      const formatted = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const monday = getMonday(formatted);
      const weekLater = new Date(formatted);
      weekLater.setDate(formatted.getDate() + 7);

      setHomeDates({
        ...homeDates,
        weekStart: monday,
        rangeStart: formatted,
        rangeEnd: homeDates?.rangeEnd ?? weekLater,
      });
    }
  };

  const onEndChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set") {
      const date = selectedDate as Date;
      const formatted = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const prevWeek = new Date(formatted);
      prevWeek.setDate(formatted.getDate() - 7);
      const monday = getMonday(prevWeek);

      setHomeDates({
        ...homeDates,
        weekStart: homeDates?.rangeStart ?? monday,
        rangeStart: homeDates?.rangeStart ?? prevWeek,
        rangeEnd: formatted,
      });
    }
  };

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.col, { gap: colGap }]}>
        <Text style={[styles.label, { color: colors.primary, fontSize: labelFontSize }]} allowFontScaling={false}>
          Start{Device.deviceType !== 1 && " date"}:
        </Text>

        {/*<Button func={() => null} fill icon="calendar">
          {props.startDate.toLocaleDateString()}
        </Button>*/}
        <DateTimePicker
          value={!homeDates ? today : homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart}
          mode="date"
          onChange={onStartChange}
          accentColor={colors.primary}
          style={{ flex: 1 }}
        />
      </View>

      <View style={[styles.col, { gap: colGap }]}>
        <Text style={[styles.label, { color: colors.primary, fontSize: labelFontSize }]} allowFontScaling={false}>
          End{Device.deviceType !== 1 && " date"}:
        </Text>

        {/*<Button func={() => null} fill icon="calendar">
          {props.endDate.toLocaleDateString()}
        </Button>*/}
        <DateTimePicker
          value={!homeDates ? today : homeDates.rangeEnd ? homeDates.rangeEnd : weekEnd}
          mode="date"
          onChange={onEndChange}
          accentColor={colors.primary}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  col: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "Circular-Book",
  },
});
