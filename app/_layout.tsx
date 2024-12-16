import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDB } from "data/database";
import { DimensionsContext, DimensionsType } from "context/dimensions";
import { HomeDatesContext, CalendarDatesType } from "context/home-dates";
import { CompanyDatesContext } from "context/company-dates";
import { theme } from "../utils/helpers";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colors = theme();
  const router = useRouter();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [dimensions, setDimensions] = useState<DimensionsType>({ width: width, height: height });
  const [homeDates, setHomeDates] = useState<CalendarDatesType>({ weekStart: new Date() });
  const [companyDates, setCompanyDates] = useState<CalendarDatesType>({ weekStart: new Date() });
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
    // Handle notification tap
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = response.notification.request.content.data.route;

      if (route) {
        router.push(route); // Navigate to the route specified in the notification
      }
    });

    return () => subscription.remove();
  }, [router]);

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
    <SQLiteProvider databaseName="mood.db" onInit={initDB}>
      <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
        <HomeDatesContext.Provider value={{ homeDates, setHomeDates }}>
          <CompanyDatesContext.Provider value={{ companyDates, setCompanyDates }}>
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
              >
                <Stack.Screen
                  name="date-filters"
                  options={{
                    presentation: "modal",
                  }}
                />
              </Stack>

              <StatusBar style="auto" />
            </GestureHandlerRootView>
          </CompanyDatesContext.Provider>
        </HomeDatesContext.Provider>
      </DimensionsContext.Provider>
    </SQLiteProvider>
  );
}
