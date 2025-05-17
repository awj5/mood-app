import { createContext } from "react";

/* Used to share globally that splash has been hidden after first load */

export type LayoutReadyContextType = {
  layoutReady: boolean;
  setLayoutReady: (layoutReady: boolean) => void;
};

export const LayoutReadyContext = createContext<LayoutReadyContextType>({
  layoutReady: false,
  setLayoutReady: () => undefined,
});
