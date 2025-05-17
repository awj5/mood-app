import { createContext } from "react";

/* Used to access device dimesions globally (needed because RN dimensions not returning acurate values on iPad rotation) */

export type DimensionsType = {
  width: number;
  height: number;
};

export type DimensionsContextType = {
  dimensions: DimensionsType;
  setDimensions: (dimensions: DimensionsType) => void;
};

export const DimensionsContext = createContext<DimensionsContextType>({
  dimensions: { width: 0, height: 0 },
  setDimensions: () => undefined,
});
