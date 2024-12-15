import { useColorScheme } from "react-native";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CalendarDatesType } from "context/home-dates";
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
    destructive: "#FF0000",
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

  var endDate = new Date(startDate);

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
  var start = "";

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
