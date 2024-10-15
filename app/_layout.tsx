import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Device from "expo-device";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DimensionsContext, DimensionsType } from "context/dimensions";
import { theme } from "../utils/helpers";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colors = theme();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [dimensions, setDimensions] = useState<DimensionsType>({ width: width, height: height });
  const initWidth = width;
  const initHeight = height;
  const initOrientation = width > height ? "landscape" : "portrait";

  const [fontsLoaded, fontError] = useFonts({
    "Circular-Black": require("../assets/fonts/lineto-circular-black.ttf"),
    "Circular-Bold": require("../assets/fonts/lineto-circular-bold.ttf"),
    "Circular-Book": require("../assets/fonts/lineto-circular-book.ttf"),
    "Circular-Medium": require("../assets/fonts/lineto-circular-medium.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Hack! - RN dimensions not returning acurate values on iPad rotation
    const listener = ScreenOrientation.addOrientationChangeListener((e) => {
      if (
        (initOrientation === "portrait" && e.orientationInfo.orientation === 3) ||
        (initOrientation === "portrait" && e.orientationInfo.orientation === 4) ||
        (initOrientation === "landscape" && e.orientationInfo.orientation !== 3 && e.orientationInfo.orientation !== 4)
      ) {
        setDimensions({ width: initHeight, height: initWidth });
      } else {
        setDimensions({ width: initWidth, height: initHeight });
      }
    });

    return () => ScreenOrientation.removeOrientationChangeListener(listener); // Clean up
  }, []);

  const changeScreenOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  if (Device.deviceType === 2) changeScreenOrientation(); // Allow landscape on tablets
  if (!fontsLoaded && !fontError) return null; // Show splash until fonts ready

  return (
    <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: colors.primaryBg,
            },
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: colors.primaryBg,
            },
            headerTintColor: colors.primary,
          }}
        />
      </GestureHandlerRootView>
    </DimensionsContext.Provider>
  );
}
