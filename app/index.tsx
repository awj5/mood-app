import { useState, useRef, useCallback, useContext, useEffect } from "react";
import { View, Pressable, useColorScheme, AppState, Platform } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Settings, Download, CircleCheck } from "lucide-react-native";
import { LayoutReadyContext, LayoutReadyContextType } from "context/layout-ready";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Calendar from "components/home/Calendar";
import HeaderDates from "components/HeaderDates";
import Bg from "components/Bg";
import BigButton from "components/BigButton";
import Content from "components/home/Content";
import Reminder from "components/Reminder";
import { CheckInType } from "types";
import { getTheme, pressedDefault } from "utils/helpers";
import { convertToISO } from "utils/dates";

export default function Home() {
  const headerHeight = useHeaderHeight();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const todayRef = useRef<Date>(null);
  const reminderSeenRef = useRef(false);
  const latestQueryRef = useRef<symbol>(null);
  const { setLayoutReady } = useContext<LayoutReadyContextType>(LayoutReadyContext);
  const { homeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [noCheckInToday, setNoCheckInToday] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [checkIns, setCheckIns] = useState<CheckInType[]>();
  const calendarHeight = Device.deviceType === 1 ? 96 : 128;

  const getCheckIns = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    const start = homeDates.rangeStart ?? homeDates.weekStart;
    let end = new Date(start);

    if (homeDates.rangeEnd) {
      end = homeDates.rangeEnd;
    } else {
      end.setDate(start.getDate() + 6); // Sunday
    }

    try {
      const rows: CheckInType[] = await db.getAllAsync(
        `SELECT * FROM check_ins WHERE DATE(datetime(date, 'localtime')) BETWEEN ? AND ? ORDER BY id ASC`,
        [convertToISO(start), convertToISO(end)]
      );

      if (latestQueryRef.current === currentQuery) setCheckIns(rows);
    } catch (error) {
      console.error(error);
    }
  };

  const showReminder = () => {
    // Show after 1 sec
    const timeout = setTimeout(async () => {
      try {
        const { status, canAskAgain } = await Notifications.getPermissionsAsync();
        if (status !== "granted" && canAskAgain) setReminderVisible(true);
      } catch (error) {
        console.error(error);
      }

      reminderSeenRef.current = true; // Prevent from being shown again in current session
    }, 1000);

    return () => clearTimeout(timeout);
  };

  const checkToday = async (init: boolean) => {
    todayRef.current = new Date();

    try {
      // Check for check-in today (date column converted to local)
      const row = await db.getFirstAsync(`SELECT id FROM check_ins WHERE DATE(datetime(date, 'localtime')) = ?`, [
        convertToISO(todayRef.current),
      ]);

      setNoCheckInToday(!row);

      // On mount only
      if (init && !row) {
        router.push("check-in"); // Redirect since user hasn't checked-in today
      } else if (init) {
        setLayoutReady(true); // Hide splash screen
      }

      if (row && !reminderSeenRef.current) showReminder();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Detect when app gets focused/unfocused
    const listener = AppState.addEventListener("change", (e) => {
      setAppState(e);
    });

    return () => listener.remove();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Only fire when app is open
      if (appState === "active") {
        checkToday(!todayRef.current); // Check if user has checked in today
        getCheckIns(); // Get all check-ins within current date range
      }
    }, [appState, homeDates, colorScheme])
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft: () => <HeaderDates dates={homeDates} type="home" />,
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.small * 2,
              }}
            >
              {/*<Pressable
                onPress={() => alert("Coming soon")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={12}
              >
                <Download
                  color={theme.color.link}
                  size={theme.icon.large.size}
                  absoluteStrokeWidth
                  strokeWidth={theme.icon.large.stroke}
                />
              </Pressable>*/}

              <Pressable
                onPress={() => router.push("settings")}
                style={({ pressed }) => pressedDefault(pressed)}
                hitSlop={12}
              >
                <Settings
                  color={theme.color.link}
                  size={theme.icon.large.size}
                  absoluteStrokeWidth
                  strokeWidth={theme.icon.large.stroke}
                />
              </Pressable>
            </View>
          ),
        }}
      />

      <Bg checkIns={checkIns} topOffset={calendarHeight} />

      <View style={{ flex: 1, marginTop: headerHeight }}>
        <Calendar height={calendarHeight} appState={appState} />
        <Content checkIns={checkIns} noCheckInToday={noCheckInToday} />
      </View>

      <View
        style={{
          paddingHorizontal: theme.spacing.base * 2,
          marginBottom: theme.spacing.base + insets.bottom,
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxWidth: 512,
          alignSelf: "center",
        }}
      >
        <BigButton route="check-in" shadow bounce={noCheckInToday} icon={CircleCheck}>
          Check-in
        </BigButton>
      </View>

      <Reminder visible={reminderVisible} setVisible={setReminderVisible} />
    </View>
  );
}
