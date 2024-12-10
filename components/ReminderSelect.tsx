import { useState } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import * as Device from "expo-device";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { theme } from "utils/helpers";

export type ReminderType = {
  days: { mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean; sun: boolean };
  time: number;
};

type DayProps = {
  text: string;
};

function Day(props: DayProps) {
  const colors = theme();
  const [isChecked, setChecked] = useState(true);

  return (
    <View style={{ alignItems: "center", gap: Device.deviceType !== 1 ? 6 : 4 }}>
      <Text
        style={[styles.text, { color: colors.primary, fontSize: Device.deviceType !== 1 ? 18 : 14 }]}
        allowFontScaling={false}
      >
        {props.text.charAt(0)}
      </Text>

      <Checkbox value={isChecked} onValueChange={setChecked} color={colors.secondary} hitSlop={8} />
    </View>
  );
}

type ReminderSelectProps = {
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function ReminderSelect(props: ReminderSelectProps) {
  const colors = theme();
  const days = ["mon", "tues", "wed", "thu", "fri", "sat", "sun"];

  const generateTimes = () => {
    const times = [];

    // Every 30 mins
    for (let hour = 0; hour < 24; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        let formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        let ampm = hour < 12 ? "am" : "pm";
        let label = `${formattedHour}:${minutes === 0 ? "00" : minutes}${ampm}`;
        let value = parseInt(`${hour.toString().padStart(2, "0")}${minutes.toString().padStart(2, "0")}`, 10); // Convert to number
        times.push({ label, value });
      }
    }

    return times;
  };

  const times = generateTimes(); // Thanks ChatGPT

  return (
    <View style={{ paddingHorizontal: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 12 : 8 }}>
      <View style={styles.days}>
        {days.map((item) => (
          <Day key={item} text={item} />
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
        itemStyle={{ fontFamily: "Circular-Book" }}
        dropdownIconColor={colors.primary}
        mode="dropdown"
      >
        {times.map((time) => (
          <Picker.Item
            key={time.value}
            label={time.label}
            value={time.value}
            color={Platform.OS === "ios" || time.value === props.reminder.time ? colors.primary : colors.secondary}
            style={{ backgroundColor: time.value === props.reminder.time ? colors.primaryBg : "white" }} // Android picker is light mode only
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
  text: {
    fontFamily: "Circular-Book",
    textTransform: "uppercase",
  },
});
