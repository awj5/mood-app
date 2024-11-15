import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView, AppState } from "react-native";
import { SplashScreen, Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Settings, Download } from "lucide-react-native";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import HeaderLeft from "components/home/HeaderLeft";
import Bg from "components/home/Bg";
import Insights from "components/home/Insights";
import Loading from "components/home/Loading";
import { pressedDefault, theme, convertToISO } from "utils/helpers";

export default function Home() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const appState = useRef(AppState.currentState);
  const isFirstFocus = useRef(true);
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [bounceCheckIn, setCheckInBounce] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const iconStroke = Device.deviceType !== 1 ? 2.5 : 2;
  const edgePadding = Device.deviceType !== 1 ? 24 : 16;

  /*const getCheckInsCount = async () => {
    try {
      const query = `
    SELECT * FROM check_ins
  `;

      const rows = await db.getAllAsync(query);
      return rows.length;
    } catch (error) {
      console.log(error);
      return 0;
    }
  };*/

  const getCheckIn = async () => {
    try {
      const today = new Date();

      // Check for check-in today (date column converted to local)
      const query = `
    SELECT * FROM check_ins
    WHERE DATE(datetime(date, 'localtime')) = ?
  `;

      const row = await db.getFirstAsync(query, [convertToISO(today)]);
      return row;
    } catch (error) {
      console.log(error);
    }
  };

  const verifyCheckIn = async () => {
    // Redirect if user hasn't checked-in today
    const checkin = await getCheckIn();
    if (!checkin) router.push("check-in"); // Redirect
    SplashScreen.hideAsync();
  };

  const initCheckInBounce = async () => {
    console.log("bounce");
    // Bounce check-in button if user hasn't checked-in today
    const checkin = await getCheckIn();
    setCheckInBounce(!checkin ? true : false);
  };

  useFocusEffect(
    useCallback(() => {
      // Don't fire on mount
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }

      initCheckInBounce();
    }, [])
  );

  useEffect(() => {
    if (appStateVisible === "active") {
      initCheckInBounce();
    }
  }, [appStateVisible]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    verifyCheckIn();
    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft: () => <HeaderLeft />,
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 24 : 20 }}>
              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Download color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>

              <Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={8}
              >
                <Settings color={colors.primary} size={iconSize} absoluteStrokeWidth strokeWidth={iconStroke} />
              </Pressable>
            </View>
          ),
        }}
      />

      <Bg />

      <View style={{ flex: 1, marginTop: headerHeight }}>
        <Calendar />

        <ScrollView contentContainerStyle={{ flex: loadingContent ? 1 : 0 }}>
          <View
            style={{
              alignItems: "center",
              flex: loadingContent ? 1 : 0,
              justifyContent: loadingContent ? "center" : "flex-start",
              paddingTop: edgePadding,
              paddingBottom: edgePadding * 2 + insets.bottom + (Device.deviceType !== 1 ? 96 : 72),
            }}
          >
            {!loadingContent ? <Insights /> : <Loading />}
          </View>
        </ScrollView>
      </View>

      <View
        style={[
          styles.footer,
          {
            padding: edgePadding,
            paddingBottom: Device.deviceType !== 1 ? 24 + insets.bottom : 16 + insets.bottom,
          },
        ]}
      >
        <BigButton route="check-in" shadow bounce={bounceCheckIn}>
          Check-in
        </BigButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
