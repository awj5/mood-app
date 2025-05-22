import * as Notifications from "expo-notifications";
import { ReminderType } from "types";

export const times = [
  { label: "12:00 am", value: "0:0" },
  { label: "12:30 am", value: "0:30" },
  { label: "1:00 am", value: "1:0" },
  { label: "1:30 am", value: "1:30" },
  { label: "2:00 am", value: "2:0" },
  { label: "2:30 am", value: "2:30" },
  { label: "3:00 am", value: "3:0" },
  { label: "3:30 am", value: "3:30" },
  { label: "4:00 am", value: "4:0" },
  { label: "4:30 am", value: "4:30" },
  { label: "5:00 am", value: "5:0" },
  { label: "5:30 am", value: "5:30" },
  { label: "6:00 am", value: "6:0" },
  { label: "6:30 am", value: "6:30" },
  { label: "7:00 am", value: "7:0" },
  { label: "7:30 am", value: "7:30" },
  { label: "8:00 am", value: "8:0" },
  { label: "8:30 am", value: "8:30" },
  { label: "9:00 am", value: "9:0" },
  { label: "9:30 am", value: "9:30" },
  { label: "10:00 am", value: "10:0" },
  { label: "10:30 am", value: "10:30" },
  { label: "11:00 am", value: "11:0" },
  { label: "11:30 am", value: "11:30" },
  { label: "12:00 pm", value: "12:0" },
  { label: "12:30 pm", value: "12:30" },
  { label: "1:00 pm", value: "13:0" },
  { label: "1:30 pm", value: "13:30" },
  { label: "2:00 pm", value: "14:0" },
  { label: "2:30 pm", value: "14:30" },
  { label: "3:00 pm", value: "15:0" },
  { label: "3:30 pm", value: "15:30" },
  { label: "4:00 pm", value: "16:0" },
  { label: "4:30 pm", value: "16:30" },
  { label: "5:00 pm", value: "17:0" },
  { label: "5:30 pm", value: "17:30" },
  { label: "6:00 pm", value: "18:0" },
  { label: "6:30 pm", value: "18:30" },
  { label: "7:00 pm", value: "19:0" },
  { label: "7:30 pm", value: "19:30" },
  { label: "8:00 pm", value: "20:0" },
  { label: "8:30 pm", value: "20:30" },
  { label: "9:00 pm", value: "21:0" },
  { label: "9:30 pm", value: "21:30" },
  { label: "10:00 pm", value: "22:0" },
  { label: "10:30 pm", value: "22:30" },
  { label: "11:00 pm", value: "23:0" },
  { label: "11:30 pm", value: "23:30" },
];

export const getReminder = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();

    const reminder = {
      days: { sun: false, mon: false, tue: false, wed: false, thu: false, fri: false, sat: false },
      time: "",
    };

    // Loop current notifications
    for (const notification of notifications) {
      const trigger = notification.trigger as any; // Casting as any because Notifications.NotificationTrigger types are a mess
      let dayKey = "";

      // Get day and time
      if ("dateComponents" in trigger) {
        // iOS
        dayKey = Object.keys(reminder.days)[trigger.dateComponents.weekday - 1]; // Day
        reminder.time = `${trigger.dateComponents.hour}:${trigger.dateComponents.minute}`; // Update time
      } else if ("weekday" in trigger) {
        // Android
        dayKey = Object.keys(reminder.days)[trigger.weekday - 1]; // Day
        reminder.time = `${trigger.hour}:${trigger.minute}`; // Update time
      }

      if (dayKey) reminder.days[dayKey as keyof ReminderType["days"]] = true; // Set day has notification
    }

    return notifications.length ? reminder : undefined;
  } catch (error) {
    console.error(error);
  }
};
