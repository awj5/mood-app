import { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Button from "components/Button";
import { theme } from "utils/helpers";

export default function Range() {
  const colors = theme();
  const { homeDates, setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  //const [date, setDate] = useState(new Date(1598051730000));

  /*const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };*/

  return (
    <View style={{ gap: Device.deviceType !== 1 ? 24 : 16 }}>
      <Text style={[styles.title, { fontSize: Device.deviceType !== 1 ? 48 : 36, color: colors.primary }]}>
        Date Range
      </Text>

      <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={[styles.col, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
          <Text
            style={[styles.label, { color: colors.secondary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
            allowFontScaling={false}
          >
            Start date
          </Text>

          <Button text="Nov 4 2024" func={() => null} fill icon="calendar"></Button>
        </View>

        <View style={[styles.col, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
          <Text
            style={[styles.label, { color: colors.secondary, fontSize: Device.deviceType !== 1 ? 20 : 16 }]}
            allowFontScaling={false}
          >
            End date
          </Text>

          <Button text="Nov 10 2024" func={() => null} fill icon="calendar"></Button>
        </View>
      </View>

      {/*<DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={onChange} />*/}
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
  label: {
    fontFamily: "Circular-Book",
  },
});
