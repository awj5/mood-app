import { createContext } from "react";

/* Used to access company insights filters (location and team) globally */

export type CompanyFiltersType = {
  locations: number[];
  teams: number[];
};

export type CompanyFiltersContextType = {
  companyFilters: CompanyFiltersType;
  setCompanyFilters: (companyFilters: CompanyFiltersType) => void;
};

export const CompanyFiltersContext = createContext<CompanyFiltersContextType>({
  companyFilters: { locations: [], teams: [] },
  setCompanyFilters: () => undefined,
});
