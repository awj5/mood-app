import { StyleSheet, View, Platform } from "react-native";
import * as Device from "expo-device";
import { Picker } from "@react-native-picker/picker";
import { ReminderType } from "components/Reminder";
import Day from "./select/Day";
import { theme, times } from "utils/helpers";

type SelectProps = {
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function Select(props: SelectProps) {
  const colors = theme();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <View
      style={{
        paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
        gap: Platform.OS === "ios" ? 0 : Device.deviceType !== 1 ? 12 : 8,
      }}
    >
      <View style={styles.days}>
        {days.map((item) => (
          <Day key={item} text={item} reminder={props.reminder} setReminder={props.setReminder} />
        ))}
      </View>

      <Picker
        selectedValue={props.reminder.time}
        onValueChange={(itemValue) =>
          props.setReminder((prevReminder) => ({
            ...prevReminder,
            time: itemValue,
          }))
        }
        itemStyle={{ fontFamily: "Circular-Book" }} // iOS only
        dropdownIconColor={colors.primary} // Android only
        mode="dropdown" // Android only
      >
        {times.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={Platform.OS === "ios" || item.value === props.reminder.time ? colors.primary : colors.secondary}
            style={{ backgroundColor: item.value === props.reminder.time ? colors.primaryBg : "white" }} // Android picker is light mode only
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  days: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
