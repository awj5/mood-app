import { View, Platform, useColorScheme } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Day from "./select/Day";
import { ReminderType } from "types";
import { getTheme } from "utils/helpers";
import { times } from "utils/reminders";

type SelectProps = {
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function Select(props: SelectProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <View
      style={{
        gap: Platform.OS === "android" ? theme.spacing / 2 : 0,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
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
        dropdownIconColor={theme.color.primary} // Android only
        mode="dropdown" // Android only
      >
        {times.map((item) => (
          <Picker.Item
            key={item.value}
            label={item.label}
            value={item.value}
            color={theme.color.primary}
            style={{
              backgroundColor: item.value === props.reminder.time ? theme.color.primaryBg : theme.color.secondaryBg, // Android only
            }}
          />
        ))}
      </Picker>
    </View>
  );
}
