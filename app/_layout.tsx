import { useEffect, useState } from "react";
import { Dimensions, Alert } from "react-native";
import { SplashScreen, Stack, useRouter } from "expo-router";
import * as Network from "expo-network";
import { useFonts } from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { SQLiteProvider } from "expo-sqlite";
import axios from "axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDB } from "data/database";
import { LayoutReadyContext } from "context/layout-ready";
import { DimensionsContext, DimensionsType } from "context/dimensions";
import { HomeDatesContext, CalendarDatesType } from "context/home-dates";
import { CompanyDatesContext } from "context/company-dates";
import { setStoredVal, theme } from "../utils/helpers";
import { getMonday } from "utils/dates";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const colors = theme();
  const router = useRouter();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [layoutReady, setLayoutReady] = useState(false);
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
    "Circular-BookItalic": require("../assets/fonts/lineto-circular-bookItalic.ttf"),
    "Circular-Medium": require("../assets/fonts/lineto-circular-medium.ttf"),
    "Tiempos-RegularItalic": require("../assets/fonts/tiempos-text-regularItalic.ttf"),
  });

  const checkforUUID = async (url: string) => {
    const { queryParams } = Linking.parse(url);

    if (queryParams?.uuid) {
      // Link includes UUID
      const network = await Network.getNetworkStateAsync();

      if (network.isInternetReachable) {
        // Validate UUID
        try {
          const response = await axios.post(
            process.env.NODE_ENV === "production" ? "https://mood.ai/api/uuid" : "http://localhost:3000/api/uuid",
            {
              uuid: queryParams.uuid,
            }
          );

          if (response.data) {
            setStoredVal("uuid", queryParams.uuid as string); // Store UUID
            setStoredVal("company-name", response.data); // Store company name

            // Trigger dashboard refresh
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const monday = getMonday(today);
            setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });

            Alert.alert(
              "You've Gone Pro!",
              `${response.data} has granted you access to their company insights and a MOOD.ai Pro subscription.`
            );
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            alert("Access code has already been used or is not valid.");
          } else {
            alert("An unexpected error has occurred.");
          }

          console.log(error);
        }
      } else {
        alert("You must be online to complete this action.");
      }
    }
  };

  useEffect(() => {
    if (layoutReady) {
      SplashScreen.hideAsync(); // Hide splash

      // Deep linking
      const handleDeepLink = (event: { url: string }) => {
        const { url } = event;
        checkforUUID(url);
      };

      Linking.getInitialURL().then((url) => {
        if (url) checkforUUID(url);
      });

      const listener = Linking.addEventListener("url", handleDeepLink);
      return () => listener.remove();
    }
  }, [layoutReady]);

  useEffect(() => {
    if (layoutReady) {
      // Handle notification tap
      const listener = Notifications.addNotificationResponseReceivedListener((response) => {
        const route = response.notification.request.content.data.route;

        if (route) {
          router.push(route); // Navigate to the route specified in the notification
        }
      });

      return () => listener.remove();
    }
  }, [router, layoutReady]);

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
      <LayoutReadyContext.Provider value={{ layoutReady, setLayoutReady }}>
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

                  <Stack.Screen
                    name="mood"
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
      </LayoutReadyContext.Provider>
    </SQLiteProvider>
  );
}
