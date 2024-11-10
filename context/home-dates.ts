import { createContext } from "react";

export type CalendarDatesType = {
  weekStart: Date;
  rangeStart?: Date;
  rangeEnd?: Date;
};

export type HomeDatesContextType = {
  homeDates: CalendarDatesType;
  setHomeDates: (homeDates: CalendarDatesType) => void;
};

export const HomeDatesContext = createContext<HomeDatesContextType>({
  homeDates: { weekStart: new Date() },
  setHomeDates: () => undefined,
});
