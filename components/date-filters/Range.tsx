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
  const labelWidth = Device.deviceType !== 1 ? 120 : 40;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(!homeDates ? today : homeDates.weekStart);
  weekEnd.setDate((!homeDates ? today : homeDates.weekStart).getDate() + 6); // Sunday

  const onStartChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set") {
      const date = selectedDate as Date;
      date.setHours(0, 0, 0, 0);
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
    if (event.type === "set") {
      const date = selectedDate as Date;
      date.setHours(0, 0, 0, 0);
      const prevWeek = new Date(date);
      prevWeek.setDate(date.getDate() - 7);
      const monday = getMonday(prevWeek);

      setHomeDates({
        ...homeDates,
        weekStart: homeDates?.rangeStart ?? monday,
        rangeStart: homeDates?.rangeStart ?? prevWeek,
        rangeEnd: date,
      });
    }
  };

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.col, { gap: colGap }]}>
        <Text
          style={[styles.label, { color: colors.primary, fontSize: labelFontSize, width: labelWidth }]}
          allowFontScaling={false}
        >
          Start{Device.deviceType !== 1 && " date:"}
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
        <Text
          style={[styles.label, { color: colors.primary, fontSize: labelFontSize, width: labelWidth }]}
          allowFontScaling={false}
        >
          End{Device.deviceType !== 1 && " date:"}
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
