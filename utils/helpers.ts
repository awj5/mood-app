import { useColorScheme } from "react-native"; // WILL REMOVE!!!
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const pressedDefault = (pressed: boolean) => {
  return {
    opacity: pressed ? 0.3 : 1,
  };
};

export const getTheme = (colorScheme: string | null | undefined) => {
  const isPhone = Device.deviceType === 1;

  return {
    color: {
      primary: colorScheme === "light" ? "black" : "white",
      secondary: colorScheme === "light" ? "#999999" : "#666666",
      link: "#0080FF",
      destructive: "#FF0000",
      opaque: colorScheme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
      primaryBg: colorScheme === "light" ? "#EEEEEE" : "#222222",
      secondaryBg: colorScheme === "light" ? "#DDDDDD" : "#333333",
      opaqueBg: colorScheme === "light" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
    },

    fontSize: {
      body: isPhone ? 16 : 20,
      large: isPhone ? 18 : 24,
      xLarge: isPhone ? 24 : 30,
      xxLarge: isPhone ? 30 : 36,
      xxxLarge: isPhone ? 36 : 48,
    },

    icon: {
      base: { size: isPhone ? 20 : 28, stroke: isPhone ? 1.5 : 2 },
    },

    spacing: isPhone ? 16 : 24,
  };
};

// WILL REMOVE!!!
export const theme = () => {
  const colorScheme = useColorScheme();

  return {
    primary: colorScheme === "light" ? "black" : "white",
    secondary: colorScheme === "light" ? "#999999" : "#666666",
    link: "#0080FF",
    destructive: "#FF0000",
    opaque: colorScheme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)",
    primaryBg: colorScheme === "light" ? "#EEEEEE" : "#222222",
    secondaryBg: colorScheme === "light" ? "#DDDDDD" : "#333333",
    opaqueBg: colorScheme === "light" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
  };
};

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [array[i], array[rand]] = [array[rand], array[i]];
  }

  return array;
};

export const getMostCommon = (array: any[]) => {
  return Array.from(new Set(array)).reduce((prev, curr) =>
    array.filter((item) => item === curr).length > array.filter((item) => item === prev).length ? curr : prev
  );
};

/* Storage */

export const getStoredVal = async (name: string) => {
  let val = null;

  try {
    val = await AsyncStorage.getItem(name);
  } catch (error) {
    console.log(error);
  }

  return val;
};

export const setStoredVal = async (name: string, val: string) => {
  try {
    await AsyncStorage.setItem(name, val);
  } catch (error) {
    console.log(error);
  }
};

export const removeStoredVal = async (name: string) => {
  try {
    await AsyncStorage.removeItem(name);
  } catch (error) {
    console.log(error);
  }
};

export const removeAccess = () => {
  // User doesn't exist or has removed company
  removeStoredVal("uuid");
  removeStoredVal("company-name");
  removeStoredVal("send-check-ins");
};
