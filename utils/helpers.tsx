import { useColorScheme } from "react-native";

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

export const isInRange = (date: Date, start?: Date, end?: Date, weekStart?: Date) => {
  var sunday: Date | undefined;

  if (weekStart && !start) {
    sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() + 6);
  }

  return (
    (weekStart && sunday && date >= weekStart && date <= sunday) ||
    (!weekStart && !start) ||
    (start && end && date >= start && date <= end)
  );
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
