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
  const today = new Date();
  const weekEnd = new Date(!homeDates ? today : homeDates.weekStart);
  weekEnd.setDate((!homeDates ? today : homeDates.weekStart).getDate() + 6); // Sunday

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setHomeDates({ weekStart: getMonday(selectedDate as Date), rangeStart: selectedDate, rangeEnd: selectedDate });
  };

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.col, { gap: Device.deviceType !== 1 ? 16 : 4 }]}>
        <Text
          style={[styles.label, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
          allowFontScaling={false}
        >
          Start{Device.deviceType !== 1 && " date"}:
        </Text>

        {/*<Button func={() => null} fill icon="calendar">
          {props.startDate.toLocaleDateString()}
        </Button>*/}
        <DateTimePicker
          value={!homeDates ? today : homeDates.rangeStart ? homeDates.rangeStart : homeDates.weekStart}
          mode="date"
          onChange={onChange}
          accentColor={colors.primary}
          style={{ flex: 1 }}
        />
      </View>

      <View style={[styles.col, { gap: Device.deviceType !== 1 ? 16 : 4 }]}>
        <Text
          style={[styles.label, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
          allowFontScaling={false}
        >
          End{Device.deviceType !== 1 && " date"}:
        </Text>

        {/*<Button func={() => null} fill icon="calendar">
          {props.endDate.toLocaleDateString()}
        </Button>*/}
        <DateTimePicker
          value={!homeDates ? today : homeDates.rangeEnd ? homeDates.rangeEnd : weekEnd}
          mode="date"
          onChange={onChange}
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
