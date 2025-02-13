import { CalendarDatesType } from "context/home-dates";

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
