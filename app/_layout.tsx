import { useEffect, useState } from "react";
import { Dimensions, Alert, Platform, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Network from "expo-network";
import { useFonts } from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { SQLiteProvider } from "expo-sqlite";
import axios from "axios";
import Purchases from "react-native-purchases";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { initDB } from "database";
import { FocusedCategoryContext } from "context/focused-category";
import { LayoutReadyContext } from "context/layout-ready";
import { DimensionsContext, DimensionsType } from "context/dimensions";
import { HomeDatesContext } from "context/home-dates";
import { CompanyDatesContext } from "context/company-dates";
import { CompanyFiltersContext, CompanyFiltersType } from "context/company-filters";
import { CalendarDatesType } from "types";
import { getStoredVal, setStoredVal, removeStoredVal, getTheme } from "../utils/helpers";
import { getMonday } from "utils/dates";

const APIKeys = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY!,
  android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY!,
};

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [layoutReady, setLayoutReady] = useState(false);
  const [dimensions, setDimensions] = useState<DimensionsType>({ width: width, height: height });
  const [homeDates, setHomeDates] = useState<CalendarDatesType>({ weekStart: new Date() });
  const [companyDates, setCompanyDates] = useState<CalendarDatesType>({ weekStart: new Date() });
  const [companyFilters, setCompanyFilters] = useState<CompanyFiltersType>({ locations: [], teams: [] });
  const [focusedCategory, setFocusedCategory] = useState(0);
  const initWidth = width;
  const initHeight = height;
  const initOrientation = width > height ? "landscape" : "portrait";
  const isSimulator = Device.isDevice === false;

  const [fontsLoaded, fontsError] = useFonts({
    "Circular-Black": require("../assets/fonts/lineto-circular-black.ttf"),
    "Circular-Bold": require("../assets/fonts/lineto-circular-bold.ttf"),
    "Circular-Book": require("../assets/fonts/lineto-circular-book.ttf"),
    "Circular-BookItalic": require("../assets/fonts/lineto-circular-bookItalic.ttf"),
    "Circular-Medium": require("../assets/fonts/lineto-circular-medium.ttf"),
    "Tiempos-RegularItalic": require("../assets/fonts/tiempos-text-regularItalic.ttf"),
    "Tiempos-Bold": require("../assets/fonts/tiempos-text-bold.ttf"),
  });

  const changeScreenOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const checkforUUID = async (url: string) => {
    const { queryParams } = Linking.parse(url);

    if (queryParams?.uuid) {
      // Link includes UUID
      const network = await Network.getNetworkStateAsync();

      if (network.isInternetReachable) {
        // Validate UUID
        try {
          const response = await axios.post(
            !isSimulator ? "https://mood-web-zeta.vercel.app/api/uuid" : "http://localhost:3000/api/uuid",
            {
              uuid: queryParams.uuid,
            }
          );

          if (response.data) {
            removeStoredVal("send-check-ins"); // Reset

            Alert.alert(
              "You've Gone Pro!",
              `${response.data} has given you access to their company insights and a MOOD.ai Pro subscription.\n\nBy accepting, you agree to share your check-ins anonymously with ${response.data}.\n\nNeither ${response.data} or MOOD.ai can identify individual check-ins or access your private chats.`,
              [
                {
                  text: "Reject",
                  onPress: () => null,
                },
                {
                  text: "Accept",
                  onPress: () => {
                    setStoredVal("uuid", queryParams.uuid as string); // Store UUID
                    setStoredVal("company-name", response.data); // Store company name
                    setStoredVal("send-check-ins", "true"); // Moved here from company disclaimer page
                    removeStoredVal("focused-statement"); // Reset MOOD Diagnostics
                    removeStoredVal("admin");
                    setHomeDates({ weekStart: getMonday(), rangeStart: undefined, rangeEnd: undefined }); // Trigger dashboard refresh
                  },
                },
              ]
            );
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            alert("Access code has already been used or is not valid.");
          } else {
            alert("An unexpected error has occurred.");
          }

          console.error(error);
        }
      } else {
        alert("You must be online to complete this action.");
      }
    }
  };

  const handleDeepLink = (e: { url: string }) => {
    checkforUUID(e.url);
  };

  const getPurchases = async () => {
    const proID = await getStoredVal("pro-id"); // Pro user

    if (proID) {
      // Confirm user is still subscribed to Pro
      try {
        const info = await Purchases.getCustomerInfo();
        if (!info.activeSubscriptions.length) removeStoredVal("pro-id"); // User not longer subscribes to Pro
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    // Handle layout ready (redirect to check-in may have occurred)
    if (layoutReady) {
      // Delay to allow for redirect
      setTimeout(() => {
        requestAnimationFrame(() => {
          SplashScreen.hideAsync(); // Hide splash
        });
      }, 100);

      if (!isSimulator) {
        Purchases.configure({ apiKey: APIKeys[Platform.OS as keyof typeof APIKeys] }); // Init RevenueCat
        getPurchases(); // Check if user subscribes to Pro
      } else {
        removeStoredVal("pro-id"); // Reset
      }

      // Check if user has clicked activation link
      Linking.getInitialURL().then((url) => {
        if (url) checkforUUID(url);
      });

      const listener = Linking.addEventListener("url", handleDeepLink); // Listen for activation link
      return () => listener.remove();
    }
  }, [layoutReady]);

  useEffect(() => {
    // Handle notification tap
    if (layoutReady) {
      const listener = Notifications.addNotificationResponseReceivedListener((response) => {
        const route = response.notification.request.content.data.route;
        if (route) router.push(route); // Navigate to the route specified in the notification
      });

      return () => listener.remove();
    }
  }, [router, layoutReady]);

  useEffect(() => {
    // Handle screen orientation
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

    if (Device.deviceType === 2) changeScreenOrientation(); // Allow landscape on tablets
    return () => ScreenOrientation.removeOrientationChangeListener(listener);
  }, []);

  if (!fontsLoaded && !fontsError) return null; // Show splash until fonts ready

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="mood.db" onInit={initDB}>
        <LayoutReadyContext.Provider value={{ layoutReady, setLayoutReady }}>
          <DimensionsContext.Provider value={{ dimensions, setDimensions }}>
            <HomeDatesContext.Provider value={{ homeDates, setHomeDates }}>
              <CompanyDatesContext.Provider value={{ companyDates, setCompanyDates }}>
                <CompanyFiltersContext.Provider value={{ companyFilters, setCompanyFilters }}>
                  <FocusedCategoryContext.Provider value={{ focusedCategory, setFocusedCategory }}>
                    <Stack
                      screenOptions={{
                        contentStyle: {
                          backgroundColor: theme.color.primaryBg,
                        },
                        headerShadowVisible: false,
                        headerStyle: {
                          backgroundColor: theme.color.primaryBg,
                        },
                        headerTintColor: theme.color.primary,
                      }}
                    >
                      <Stack.Screen name="index" />
                      <Stack.Screen name="check-in" />
                      <Stack.Screen name="company" />
                      <Stack.Screen name="settings" />
                      <Stack.Screen name="chat" />
                      <Stack.Screen name="day" />
                      <Stack.Screen name="category" />

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

                      <Stack.Screen
                        name="pro"
                        options={{
                          presentation: "modal",
                        }}
                      />

                      <Stack.Screen
                        name="company-filters"
                        options={{
                          presentation: "modal",
                          headerShown: false,
                        }}
                      />
                    </Stack>

                    <StatusBar style="auto" />
                  </FocusedCategoryContext.Provider>
                </CompanyFiltersContext.Provider>
              </CompanyDatesContext.Provider>
            </HomeDatesContext.Provider>
          </DimensionsContext.Provider>
        </LayoutReadyContext.Provider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
