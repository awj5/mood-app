import { createContext } from "react";
import { CalendarDatesType } from "types";

/* Used to access user dashboard dates globally */

export type HomeDatesContextType = {
  homeDates: CalendarDatesType;
  setHomeDates: (homeDates: CalendarDatesType) => void;
};

export const HomeDatesContext = createContext<HomeDatesContextType>({
  homeDates: { weekStart: new Date() },
  setHomeDates: () => undefined,
});
