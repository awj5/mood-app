import { useColorScheme } from "react-native";

/* Pressable */

export const pressedDefault = (pressed: boolean) => {
  return {
    opacity: pressed ? 0.25 : 1,
  };
};

/* Theme */

export const theme = () => {
  const colorScheme = useColorScheme();

  return {
    primary: colorScheme === "light" ? "black" : "white",
    secondary: colorScheme === "light" ? "#999999" : "#666666",
    primaryBg: colorScheme === "light" ? "#EEEEEE" : "#222222",
  };
};
