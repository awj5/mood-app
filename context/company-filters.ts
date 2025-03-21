import { createContext } from "react";

export type CompanyFiltersType = {
  locations: number[];
  teams: number[];
};

export type CompanyFiltersContextType = {
  companyFilters: CompanyFiltersType | undefined;
  setCompanyFilters: (companyFilters: CompanyFiltersType) => void;
};

export const CompanyFiltersContext = createContext<CompanyFiltersContextType>({
  companyFilters: undefined,
  setCompanyFilters: () => undefined,
});
