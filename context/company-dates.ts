import { createContext } from "react";
import { CalendarDatesType } from "types";

/* Used to access company insights dates globally */

export type CompanyDatesContextType = {
  companyDates: CalendarDatesType;
  setCompanyDates: (companyDates: CalendarDatesType) => void;
};

export const CompanyDatesContext = createContext<CompanyDatesContextType>({
  companyDates: { weekStart: new Date() },
  setCompanyDates: () => undefined,
});
