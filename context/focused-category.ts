import { createContext } from "react";

/* Used to share a company's focused category (will only show statements for that category) globally */

export type FocusedCategoryContextType = {
  focusedCategory: number;
  setFocusedCategory: (focusedCategory: number) => void;
};

export const FocusedCategoryContext = createContext<FocusedCategoryContextType>({
  focusedCategory: 0,
  setFocusedCategory: () => undefined,
});
