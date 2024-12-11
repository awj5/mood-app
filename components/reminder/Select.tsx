import { useEffect } from "react";
import { StyleSheet, View, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";
import { ReminderType } from "components/Reminder";
import Day from "./select/Day";
import { theme } from "utils/helpers";

type SelectProps = {
  reminder: ReminderType;
  setReminder: React.Dispatch<React.SetStateAction<ReminderType>>;
};

export default function Select(props: SelectProps) {
  const colors = theme();
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const times = [
    { label: "12:00am", value: "0:0" },
    { label: "12:30am", value: "0:30" },
    { label: "1:00am", value: "1:0" },
    { label: "1:30am", value: "1:30" },
    { label: "2:00am", value: "2:0" },
    { label: "2:30am", value: "2:30" },
    { label: "3:00am", value: "3:0" },
    { label: "3:30am", value: "3:30" },
    { label: "4:00am", value: "4:0" },
    { label: "4:30am", value: "4:30" },
    { label: "5:00am", value: "5:0" },
    { label: "5:30am", value: "5:30" },
    { label: "6:00am", value: "6:0" },
    { label: "6:30am", value: "6:30" },
    { label: "7:00am", value: "7:0" },
    { label: "7:30am", value: "7:30" },
    { label: "8:00am", value: "8:0" },
    { label: "8:30am", value: "8:30" },
    { label: "9:00am", value: "9:0" },
    { label: "9:30am", value: "9:30" },
    { label: "10:00am", value: "10:0" },
    { label: "10:30am", value: "10:30" },
    { label: "11:00am", value: "11:0" },
    { label: "11:30am", value: "11:30" },
    { label: "12:00pm", value: "12:0" },
    { label: "12:30pm", value: "12:30" },
    { label: "1:00pm", value: "13:0" },
    { label: "1:30pm", value: "13:30" },
    { label: "2:00pm", value: "14:0" },
    { label: "2:30pm", value: "14:30" },
    { label: "3:00pm", value: "15:0" },
    { label: "3:30pm", value: "15:30" },
    { label: "4:00pm", value: "16:0" },
    { label: "4:30pm", value: "16:30" },
    { label: "5:00pm", value: "17:0" },
    { label: "5:30pm", value: "17:30" },
    { label: "6:00pm", value: "18:0" },
    { label: "6:30pm", value: "18:30" },
    { label: "7:00pm", value: "19:0" },
    { label: "7:30pm", value: "19:30" },
    { label: "8:00pm", value: "20:0" },
    { label: "8:30pm", value: "20:30" },
    { label: "9:00pm", value: "21:0" },
    { label: "9:30pm", value: "21:30" },
    { label: "10:00pm", value: "22:0" },
    { label: "10:30pm", value: "22:30" },
    { label: "11:00pm", value: "23:0" },
    { label: "11:30pm", value: "23:30" },
  ];

  const fetchScheduledNotifications = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

      const updatedReminder = {
        days: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        time: "",
      };

      // Loop current notifications
      for (let i = 0; i < scheduledNotifications.length; i++) {
        let trigger = scheduledNotifications[i].trigger;

        if (trigger && "dateComponents" in trigger) {
          let weekday = trigger.dateComponents.weekday;

          if (weekday) {
            let dayKey = Object.keys(updatedReminder.days)[weekday - 1];
            updatedReminder.days[dayKey as keyof ReminderType["days"]] = true; // Update day value
            updatedReminder.time = `${trigger.dateComponents.hour}:${trigger.dateComponents.minute}`; // Update time
          }
        }
      }

      if (scheduledNotifications.length) props.setReminder(updatedReminder); // Replace default reminder with existing
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchScheduledNotifications();
  }, []);

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
