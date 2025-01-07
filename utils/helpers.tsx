import { useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CalendarDatesType } from "context/home-dates";
import { ReminderType } from "components/Reminder";
import { CheckInMoodType, CheckInType } from "data/database";

/* Pressable */

export const pressedDefault = (pressed: boolean) => {
  return {
    opacity: pressed ? 0.3 : 1,
  };
};

/* Theme */

export const theme = () => {
  const colorScheme = useColorScheme();

  return {
    primary: colorScheme === "light" ? "black" : "white",
    secondary: colorScheme === "light" ? "#999999" : "#666666",
    primaryBg: colorScheme === "light" ? "#EEEEEE" : "#222222",
    secondaryBg: colorScheme === "light" ? "#DDDDDD" : "#333333",
  };
};

/* Dates */

export const convertToISO = (date: Date) => {
  const isoDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return isoDate;
};

export const getMonday = (date: Date) => {
  const day = date.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - daysFromMonday);
  return monday;
};

export const getDateRange = (dates: CalendarDatesType, showDays?: boolean) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  const year = today.getFullYear();
  const startDate = dates.rangeStart ? dates.rangeStart : dates.weekStart;

  const start = `${months[startDate.getMonth()]} ${startDate.getDate()}${
    startDate.getFullYear() !== year ? ` ${startDate.getFullYear()}` : ""
  }`;

  let endDate = new Date(startDate);

  if (dates.rangeEnd) {
    endDate = dates.rangeEnd;
  } else {
    endDate.setDate(dates.weekStart.getDate() + 6); // Sunday
  }

  const end = `${months[endDate.getMonth()]} ${endDate.getDate()}${
    endDate.getFullYear() !== year ? ` ${endDate.getFullYear()}` : ""
  }`;

  return showDays && start === end
    ? startDate.toDateString().replace(` ${year}`, "")
    : showDays
    ? `${startDate.toDateString().replace(` ${year}`, "")} \u2013 ${endDate.toDateString().replace(` ${year}`, "")}`
    : start === end
    ? start
    : `${start} \u2013 ${end}`;
};

/* Data */

export const getStatement = (statement: string, response: number) => {
  const percentage = Math.round(response * 100);
  let start = "";

  switch (true) {
    case response >= 0.85:
      start = `I strongly agreed (${percentage}%) that `;
      break;
    case response >= 0.65:
      start = `I agreed (${percentage}%) that `;
      break;
    case response >= 0.55:
      start = `I somewhat agreed (${percentage}%) that `;
      break;
    case response >= 0.45:
      start = `I neither agreed nor disagreed (${percentage}%) that `;
      break;
    case response >= 0.35:
      start = `I somewhat disagreed (${percentage}%) that `;
      break;
    case response >= 0.15:
      start = `I disagreed (${percentage}%) that `;
      break;
    default:
      start = `I strongly disagreed (${percentage}%) that `;
  }

  return start + statement + " at work.";
};

export type PromptDataType = {
  date: string;
  time: string;
  feelings: string[];
  statement: string;
  note: string;
};

export const getPromptData = (checkIns: CheckInType[]) => {
  const data: PromptDataType[] = [];
  const ids = []; // Used to collect check-in IDs

  // Loop check-ins and create prompt objects
  for (let i = 0; i < checkIns.length; i++) {
    let checkIn = checkIns[i];
    let utc = new Date(`${checkIn.date}Z`);
    let local = new Date(utc);
    let mood: CheckInMoodType = JSON.parse(checkIn.mood);
    let tags: string[] = [];

    // Get tag names
    for (let i = 0; i < mood.tags.length; i++) {
      tags.push(tagsData.filter((tag) => tag.id === mood.tags[i])[0].name);
    }

    data.push({
      date: local.toDateString(),
      time: local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
      feelings: tags,
      statement: getStatement(
        guidelinesData[0].competencies.filter((item) => item.id === mood.competency)[0].statement,
        mood.statementResponse
      ),
      note: checkIn.note,
    });

    ids.push(checkIn.id);
  }

  return { data, ids };
};

/* Notifications */

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
    for (let i = 0; i < notifications.length; i++) {
      let trigger = notifications[i].trigger;
      let dayKey = "";

      if ("weekday" in trigger) {
        // Android
        dayKey = Object.keys(reminder.days)[trigger.weekday - 1];
        reminder.time = `${trigger.hour}:${trigger.minute}`; // Update time
      } else if ("dateComponents" in trigger && trigger.dateComponents.weekday) {
        // iOS
        dayKey = Object.keys(reminder.days)[trigger.dateComponents.weekday - 1];
        reminder.time = `${trigger.dateComponents.hour}:${trigger.dateComponents.minute}`; // Update time
      }

      reminder.days[dayKey as keyof ReminderType["days"]] = true; // Update day value
    }

    return notifications.length ? reminder : undefined;
  } catch (error) {
    console.log(error);
  }
};
