import { createContext } from "react";

export type LayoutReadyContextType = {
  layoutReady: boolean;
  setLayoutReady: (layoutReady: boolean) => void;
};

export const LayoutReadyContext = createContext<LayoutReadyContextType>({
  layoutReady: false,
  setLayoutReady: () => undefined,
});
