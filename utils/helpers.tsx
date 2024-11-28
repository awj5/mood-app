import { useColorScheme } from "react-native";
import { CalendarDatesType } from "context/home-dates";

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

  return showDays
    ? `${startDate.toDateString().replace(` ${year}`, "")} \u2013 ${endDate.toDateString().replace(` ${year}`, "")}`
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

  return start + statement;
};
