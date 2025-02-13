import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const pressedDefault = (pressed: boolean) => {
  return {
    opacity: pressed ? 0.3 : 1,
  };
};

export const theme = () => {
  const colorScheme = useColorScheme();

  return {
    primary: colorScheme === "light" ? "black" : "white",
    secondary: colorScheme === "light" ? "#999999" : "#666666",
    primaryBg: colorScheme === "light" ? "#EEEEEE" : "#222222",
    secondaryBg: colorScheme === "light" ? "#DDDDDD" : "#333333",
  };
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }

  return array;
};

export const getStoredVal = async (name: string) => {
  try {
    const val = await AsyncStorage.getItem(name);
    return val;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const removeStoredVal = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.log(error);
  }
};
